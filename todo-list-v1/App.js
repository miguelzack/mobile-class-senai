import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { theme } from "./src/styles/global";
import AddTask from "./src/components/AddTask";
import EdiTask from "./src/components/EditTask";
import SearchBar from "./src/components/SearchBar";
import TaskCard from "./src/components/TaskCard";

export default function App() {

  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [addVisible, setAddVisbile] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedTask, setSelectedVisible] = useState(null  );

  const addTask = (newTask) => {
    setTasks([...tasks, {...newTask, id: Date.now().toString()}])
    setAddVisbile(false)
  }

  const updateTask = (updateTask) => {
    setTask(tasks.map)
  }
}
