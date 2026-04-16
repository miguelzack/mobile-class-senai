import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function TaskCard({ item, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.priority}>Prioridade: {item.priority}</Text>
        <Text style={{fontSize: 10}}>{item.start} até {item.end}</Text>
      </View>
      
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity onPress={() => onEdit(item)}><Text>✏️</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}><Text>🗑️</Text></TouchableOpacity>
      </View>
    </View>
  );
}