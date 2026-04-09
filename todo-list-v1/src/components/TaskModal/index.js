import {Modal, View, Text, TextInput, TouchableOpacity} from "react-native";
import styles from "./style.js"
import {useEffect, useState} from "react";

export default function TaskModal({visible, onClose, onSave, taskToEdit}) {
    const [form, setForm] = useState({
        title: "", description: "", startDate: "", endDate: "", priority: "Média"
    })

    useEffect(() => {
        if (taskToEdit) setForm(taskToEdit); else setForm({
            title: "", description: "", startDate: "", endDate: "", priority: "Média"
        })
    }, [taskToEdit, visible])

    return (<Modal visible={visible} animationType={"slide"}>
        <View style={styles.modalBody}>
            <Text style={styles.label}>
                {taskToEdit ? 'Editar tarefa' : 'Nova tarefa'}
            </Text>

            <TextInput style={styles.input}
                       placeholder={'Título'}
                       value={form.title}
                       onChangeText={v => setForm({
                           ...form, title: v
                       })}
            />
            <TextInput style={styles.input}
                       placeholder={'Descrição'}
                       value={form.description}
                       onChangeText={v => setForm({
                           ...form, description: v
                       })}
            />
            <TextInput style={styles.input}
                       placeholder={'Data de início: DD/MM?'}
                       value={form.startDate}
                       onChangeText={v => setForm({
                           ...form, startDate: v
                       })}
            />
            <TextInput style={styles.input}
                       placeholder={'Data de conclusão: DD/MM'}
                       value={form.endDate}
                       onChangeText={v => setForm({
                           ...form, endDate: v
                       })}
            />
            <TextInput style={styles.input}
                       placeholder={'Prioridade (Baixa, Média ou Alta)'}
                       value={form.priority}
                       onChangeText={v => setForm({
                           ...form, priority: v
                       })}
            />

            <TouchableOpacity style={styles.btnSave}
                              onPress={() => onSave(form)}
            >
                <Text style={styles.bntText}>
                    Salvar Tarefa
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}
            >
                <Text style={styles.bntCancelar}>
                    Cancelar
                </Text>
            </TouchableOpacity>
        </View>
    </Modal>)
}