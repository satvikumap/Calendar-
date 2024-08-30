import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios'; // Import axios for API requests
import { fetchTasksByDate } from '../db/sqlite'; // Adjust the import path accordingly

const EventDetailsScreen = ({ route }) => {
  const { selectedDate } = route.params;
  const [tasks, setTasks] = useState([]);
  const [festivals, setFestivals] = useState([]);
  
  useEffect(() => {
    // Fetch tasks from SQLite for the selected date
    fetchTasksByDate(selectedDate)
      .then((fetchedTasks) => setTasks(fetchedTasks))
      .catch((error) => console.error('Error fetching tasks:', error));
    
    // Fetch festival data from Festivo API
    fetchFestivals(selectedDate);
  }, [selectedDate]);

  const fetchFestivals = async (date) => {
    // Map of month abbreviations to their numerical values
    date = date.replace(/,/g, '');
    const monthMap = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    // Split the date into year, month, and day
    const [month, day, year] = date.split(' ');

    // Convert month abbreviation to numerical value
    const numericMonth = monthMap[month] || '01'; // Default to January if month is invalid
    console.log(numericMonth)
    console.log(year)
    console.log(day)
    try {
      const response = await axios.get('https://api.getfestivo.com/public-holidays/v3/list', {
        params: {
          api_key: 'tok_v3_SaMkLOEEppfSxzyZayyvPZ0oeKnTweFQ1t894x48hpFq6mo1',
          year:year,
          month: numericMonth,
          day:day,
          country: 'in', // Country code for India
        },
      });
      setFestivals(response.data.holidays); // Assuming the festival data is in 'holidays'
    } catch (error) {
      console.error('Error fetching festivals:', error);
    }
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskSubtitle}>{item.subtitle}</Text>
    </View>
  );

  const renderFestivalItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text style={styles.taskSubtitle}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Events for {selectedDate}</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />
      <Text style={styles.headerText}>Festivals</Text>
      <FlatList
        data={festivals}
        renderItem={renderFestivalItem}
        keyExtractor={(item) => item.id || item.name} // Assuming 'id' or 'name' is unique
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskList: {
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default EventDetailsScreen;
