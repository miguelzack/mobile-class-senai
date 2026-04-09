import React, {useState} from "react";
import {Modal, View, Text, TextInput, TouchableOpacity} from "react-native";
import styles from "./style"

export default function AddTask({visible, onSave, onClose}) {
    const {task, setTask} = useState({title: "", description: "", priority: "", start: "", end: ""})

    const handleSave = () => {
        onSave(task);
        setTask({title: "", description: "", priority: "", start: "", end: ""})
    }

    return (<Modal visible={visible} animationType={"slide"}>
        <View style={styles.modal}>
            <Text style={styles.titulo}>
                Nova Tarefa
            </Text>
            <TextInput
                placeholder={"Título"}
                style={styles.input}
                onChangeText={t => setTask({
                    ...task, title: t
                })}
            />
            <TextInput
                placeholder={"Descrição"}
                style={styles.input}
                onChangeText={t => setTask({
                    ...task, description: t
                })}
            />
            <TextInput
                placeholder={"Prioridade: Baixa, Média ou Alta "}
                style={styles.input}
                onChangeText={t => setTask({
                    ...task, priority: t
                })}
            />
            <TextInput
                placeholder={"Data de Início: DD/MM"}
                style={styles.input}
                onChangeText={t => setTask({
                    ...task, start: t
                })}
            />
            <TextInput
                placeholder={"Data de Fim: DD/MM"}
                style={styles.input}
                onChangeText={t => setTask({
                    ...task, end: t
                })}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text>Salvar Tarefa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.txtCancelar}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    </Modal>)
}