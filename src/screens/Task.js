import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarPicker from 'react-native-calendar-picker';
import dayjs from 'dayjs';
import { insertTask } from '../db/sqlite';

const TaskScreen = ({navigation}) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('ddd, MMM D, YYYY'),
  );
  const [calendarDate, setCalendarDate] = useState(
    dayjs().format('MMM D, YYYY'),
  );
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const handleDateChange = date => {
    setSelectedDate(dayjs(date).format('ddd, MMM D, YYYY'));
    setCalendarDate(dayjs(date).format('MMM D, YYYY'));
  };

  const handleCancle = ()=>{
    navigation.navigate('Calendar')
  }
  const handleSave = ()=>{
    if (title.trim() !== '' && subtitle.trim() !== '') {
      insertTask(title, subtitle, calendarDate)
        .then(() => {
          console.log('Task saved successfully');
          navigation.navigate('Calendar');
        })
        .catch((error) => console.error('Error saving task:', error));
    } else {
      alert('Please enter both title and subtitle.');
    }
    navigation.navigate('Calendar')
  }
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Icon name="close" size={30} color="#fff" onPress={handleCancle} />
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <TextInput
        style={styles.titleInput}
        placeholder="Add title"
        placeholderTextColor="#777"
        onChangeText={setTitle}
      />

      {/* Task Information Section */}
      <View style={styles.taskInfo}>
        <Icon name="calendar-today" size={24} color="#ccc" />
        <View style={styles.taskDetails}>
          <Text style={styles.taskText}>Tasks</Text>
          <Text style={styles.emailText}>yashgupta61969@gmail.com</Text>
        </View>
      </View>

      {/* Task Description Input */}
      <View style={styles.taskInput}>
        <Icon name="short-text" size={24} color="#ccc" />
        <TextInput
          style={styles.descriptionInput}
          placeholder="This is a deko task"
          placeholderTextColor="#777"
          onChangeText={setSubtitle}
        />
      </View>

      {/* All-day Toggle */}
      <View style={styles.allDayToggle}>
        <View style={{flexDirection: 'row'}}>
          <Icon name="schedule" size={24} color="#ccc" />
          <Text style={styles.allDayText}>All-day</Text>
        </View>
        <View>
          <Switch
            value={true}
            trackColor={{false: '#767577', true: '#8249ff'}}
            thumbColor="#1b1b1b"
          />
        </View>
      </View>

      {/* Date Section */}
      <TouchableOpacity
        onPress={() => setCalendarVisible(true)}
        style={styles.dateSection}>
        <Text style={styles.dateText}>{selectedDate}</Text>
      </TouchableOpacity>

      {/* Repeat Section */}
      <View style={styles.repeatSection}>
        <Icon name="repeat" size={24} color="#ccc" />
        <Text style={styles.repeatText}>Does not repeat</Text>
      </View>

      {/* Calendar Modal */}
      <Modal
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.textcontainer}>
              <View>
                <Text style={styles.modalSelected}>Select Date</Text>
                <Text style={styles.DatemodalSelected}>{calendarDate}</Text>
              </View>
              <View>
                <Icon name="edit" size={24} color="#ccc" style={styles.iconEdit}/>
              </View>
            </View>

            <CalendarPicker
              weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              previousTitle="<"
              nextTitle=">"
              textStyle={styles.textStyle}
              onDateChange={handleDateChange}
              selectedDayStyle={{backgroundColor: '#8249ff'}}
              todayBackgroundColor={{backgroundColor: '#ffFFff'}}
              todayTextStyle={{
                borderWidth: 1,
                borderRadius: 20,
                borderColor: '#8249ff',
                padding: 6,
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={styles.modalOk}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  saveButton: {
    color: '#FFFFFF',
    backgroundColor: '#8249ff',
    borderRadius: 20,
    padding: 7,
    paddingLeft: 18,
    paddingRight: 18,
    fontSize: 18,
  },
  titleInput: {
    fontSize: 35,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
  },
  iconEdit:{
    marginTop:55,
  },
  taskDetails: {
    marginLeft: 15,
  },
  taskText: {
    color: '#fff',
    fontSize: 18,
  },
  emailText: {
    color: '#777',
    fontSize: 16,
  },
  taskInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
  },
  descriptionInput: {
    marginLeft: 15,
    color: '#fff',
    flex: 1,
    fontSize: 20,
  },
  allDayToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  allDayText: {
    color: '#fff',
    fontSize: 20,
    paddingHorizontal: 20,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
  repeatSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textcontainer: {
    marginBottom: 50,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  repeatText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  DatemodalSelected: {
    color: '#fff',
    fontSize: 30,
    marginTop: 20,
    justifyContent: 'flex-start',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 60,
  },
  modalSelected: {
    color: '#fff',
    fontSize: 18,
    justifyContent: 'flex-start',
  },
  modalCancel: {
    color: '#fff',
    fontSize: 18,
    marginRight: 20,
  },
  modalOk: {
    color: '#8249ff',
    fontSize: 18,
  },
});

export default TaskScreen;
