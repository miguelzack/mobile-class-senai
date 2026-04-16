import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function TaskModal({ visible, onClose, onSave, taskToEdit }) {
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', priority: 'Média' });

  useEffect(() => {
    if (taskToEdit) setForm(taskToEdit);
    else setForm({ title: '', description: '', startDate: '', endDate: '', priority: 'Média' });
  }, [taskToEdit, visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalBody}>
        <Text style={styles.label}>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
        <TextInput style={styles.input} placeholder="Título" value={form.title} onChangeText={v => setForm({...form, title: v})} />
        <TextInput style={styles.input} placeholder="Descrição" value={form.description} onChangeText={v => setForm({...form, description: v})} />
        <TextInput style={styles.input} placeholder="Início (DD/MM)" value={form.startDate} onChangeText={v => setForm({...form, startDate: v})} />
        <TextInput style={styles.input} placeholder="Término (DD/MM)" value={form.endDate} onChangeText={v => setForm({...form, endDate: v})} />
        
        <TouchableOpacity style={styles.btnSave} onPress={() => onSave(form)}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}><Text style={styles.btnClose}>Cancelar</Text></TouchableOpacity>
      </View>
    </Modal>
  );
}