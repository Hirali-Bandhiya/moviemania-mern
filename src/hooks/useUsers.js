import { useState, useEffect, useCallback } from "react";
import { getUsers } from "../services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
      setError("");
      return data;
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
      setError("Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, setUsers, loading, error, loadUsers };
};
