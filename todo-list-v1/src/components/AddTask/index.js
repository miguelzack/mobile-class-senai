import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function AddTask({ visible, onSave, onClose }) {
  const [task, setTask] = useState({ title: '', description: '', priority: 'Média', start: '', end: '' });

  const handleSave = () => {
    onSave(task); // Envia os dados para o App.js
    setTask({ title: '', description: '', priority: 'Média', start: '', end: '' }); // Limpa o form
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modal}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Nova Tarefa</Text>
        <TextInput placeholder="Título" style={styles.input} onChangeText={t => setTask({...task, title: t})} />
        <TextInput placeholder="Descrição" style={styles.input} onChangeText={t => setTask({...task, description: t})} />
        <TextInput placeholder="Prioridade (Alta/Média/Baixa)" style={styles.input} onChangeText={t => setTask({...task, priority: t})} />
        <TextInput placeholder="Data Início (DD/MM)" style={styles.input} onChangeText={t => setTask({...task, start: t})} />
        <TextInput placeholder="Data Fim (DD/MM)" style={styles.input} onChangeText={t => setTask({...task, end: t})} />
        
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={{color: '#FFF'}}>Salvar Tarefa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={{marginTop: 15}}><Text style={{textAlign: 'center', color: 'red'}}>Cancelar</Text></TouchableOpacity>
      </View>
    </Modal>
  );
}