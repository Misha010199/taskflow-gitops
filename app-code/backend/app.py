from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_client import supabase
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "API Running"


@app.route("/tasks", methods=["GET"])
def get_tasks():
    try:
        res = supabase.table("tasks").select("*").execute()
        return jsonify(res.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/tasks", methods=["POST"])
def add_task():
    body = request.json or {}

    if "title" not in body:
        return jsonify({"error": "Title required"}), 400

    try:
        task_data = {
            "title": body["title"],
            "status": body.get("status", "todo"),
            "labels": body.get("labels", []),
            "priority": body.get("priority", "medium"),
            "due_date": body.get("due_date"),
            "description": body.get("description", "")
        }
        
        res = supabase.table("tasks").insert(task_data).execute()
        
       
        supabase.table("activity_log").insert({
            "task_id": res.data[0]["id"],
            "action": "created",
            "details": {"title": body["title"]}
        }).execute()
        
        return jsonify(res.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    body = request.json or {}

    try:
       
        update_data = {}
        allowed_fields = ["title", "status", "labels", "priority", "due_date", "description"]
        
        for field in allowed_fields:
            if field in body:
                update_data[field] = body[field]
        
        res = supabase.table("tasks").update(update_data).eq("id", id).execute()
        
    
        supabase.table("activity_log").insert({
            "task_id": id,
            "action": "updated",
            "details": update_data
        }).execute()
        
        return jsonify(res.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    try:
       
        supabase.table("activity_log").delete().eq("task_id", id).execute()
        supabase.table("tasks").delete().eq("id", id).execute()
        return jsonify({"message": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/analytics", methods=["GET"])
def get_analytics():
    try:
        
        tasks = supabase.table("tasks").select("*").execute()
        tasks_data = tasks.data
        
       
        activities = supabase.table("activity_log").select("*").execute()
        
        
        total = len(tasks_data)
        completed = len([t for t in tasks_data if t.get("status") == "done"])
        in_progress = len([t for t in tasks_data if t.get("status") == "doing"])
        todo = len([t for t in tasks_data if t.get("status") == "todo"])
        
        
        labels_count = {}
        for task in tasks_data:
            for label in task.get("labels", []):
                labels_count[label] = labels_count.get(label, 0) + 1
        
       
        priority_count = {
            "high": len([t for t in tasks_data if t.get("priority") == "high"]),
            "medium": len([t for t in tasks_data if t.get("priority") == "medium"]),
            "low": len([t for t in tasks_data if t.get("priority") == "low"])
        }
        
      
        now = datetime.now().isoformat()
        overdue = len([t for t in tasks_data if t.get("due_date") and t.get("due_date") < now and t.get("status") != "done"])
        
       
        last_week = (datetime.now() - timedelta(days=7)).isoformat()
        created_last_week = len([t for t in tasks_data if t.get("created_at", "") > last_week])
        
        
        completion_trend = []
        for i in range(6, -1, -1):
            day = datetime.now() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0).isoformat()
            day_end = day.replace(hour=23, minute=59, second=59).isoformat()
            
            completed_count = len([
                t for t in tasks_data 
                if t.get("status") == "done" 
                and t.get("updated_at", "").split('T')[0] == day.strftime('%Y-%m-%d')
            ])
            
            completion_trend.append({
                "date": day.strftime('%Y-%m-%d'),
                "completed": completed_count
            })
        
        return jsonify({
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "todo": todo,
            "completion_rate": round((completed / total * 100) if total > 0 else 0, 1),
            "labels_count": labels_count,
            "priority_count": priority_count,
            "overdue": overdue,
            "created_last_week": created_last_week,
            "completion_trend": completion_trend
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)