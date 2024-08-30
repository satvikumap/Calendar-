import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import axios from 'axios';
import { fetchAllTasks } from '../db/sqlite';
import notifee from '@notifee/react-native';

const CalendarScreen = ({ navigation }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));
  const [tasks, setTasks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const calendarRef = useRef(null);

  // Function to fetch holidays
  const fetchHolidays = async () => {
    const monthYear = moment(currentMonth, 'MMMM YYYY');
    const year = monthYear.year();
    const month = monthYear.month() + 1; // month is 0-indexed in moment.js

    try {
      const response = await axios.get('https://api.getfestivo.com/public-holidays/v3/list', {
        params: {
          api_key: 'tok_v3_SaMkLOEEppfSxzyZayyvPZ0oeKnTweFQ1t894x48hpFq6mo1',
          year: year,
          month: month,
          country: 'in', // Country code for India
        }
      });
      setHolidays(response.data.holidays || []);
    } catch (error) {
      console.error('Error fetching holidays:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch holidays when the currentMonth changes
  useEffect(() => {
    fetchHolidays();
  }, [currentMonth]);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchAllTasks()
      .then(fetchedTasks => {
        const taskDates = fetchedTasks.map(task => task.date);
        setTasks(taskDates);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Handle date change
  const onDateChange = date => {
    const formattedDate = moment(date).format('MMM D, YYYY');
    setSelectedStartDate(formattedDate);
    navigation.navigate('Events', { selectedDate: formattedDate });

    // Schedule a notification for the selected date
    scheduleNotification(formattedDate);
  };

  // Handle swipe gestures for changing months
  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -50) {
        setCurrentMonth(prev => {
          const newMonth = moment(prev, 'MMMM YYYY').add(1, 'month');
          if (calendarRef.current) {
            calendarRef.current.handleOnPressNext();
          }
          return newMonth.format('MMMM YYYY');
        });
      } else if (nativeEvent.translationX > 50) {
        setCurrentMonth(prev => {
          const newMonth = moment(prev, 'MMMM YYYY').subtract(1, 'month');
          if (calendarRef.current) {
            calendarRef.current.handleOnPressPrevious();
          }
          return newMonth.format('MMMM YYYY');
        });
      }
    }
  };

  // Customize date styles
  const customDatesStyles = date => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const isSelected = formattedDate === moment(selectedStartDate).format('YYYY-MM-DD');
    const isHoliday = holidays.some(holiday => moment(holiday.date).format('YYYY-MM-DD') === formattedDate);
    const hasTask = tasks.includes(moment(date).format('MMM D, YYYY'));

    return {
      containerStyle: {
        borderWidth: 0.5,
        borderColor: '#949292',
        padding: 20,
        paddingBottom: 125,
        backgroundColor: 'transparent',
      },
      style: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      textStyle: {
        color: isHoliday ? 'red' : hasTask ? 'blue' : isSelected ? 'blue' : '#FFFFFF',
      },
      allowDisabled: false,
    };
  };

  // Function to schedule a notification
  const scheduleNotification = async (date) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Event Reminder',
      body: `You have an event scheduled for ${date}`,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.headerContent}>
          <Icon name="menu" size={30} color="#fff" />
          <Text style={styles.headerText}>{currentMonth}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon name="search" size={30} color="#fff" style={styles.icon} />
          <Icon name="event" size={30} color="#fff" style={styles.icon} />
          <Icon name="person" size={30} color="#fff" style={styles.icon} />
        </View>
      </View>

      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View>
          <CalendarPicker
            ref={calendarRef}
            weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
            textStyle={styles.textStyle}
            todayBackgroundColor="#1ea0eb"
            dayLabelsWrapper={styles.dayLabelsWrapper}
            dayWrapper={styles.dateContainerStyle}
            onDateChange={onDateChange}
            onMonthChange={date => setCurrentMonth(moment(date).format('MMMM YYYY'))}
            selectedDayTextColor="#FFFFFF"
            showDayStragglers={true}
            customDatesStyles={customDatesStyles}
            customDayHeaderStyles={() => ({ textStyle: { color: '#FFFFFF' } })}
            headerWrapperStyle={styles.customHeader}
          />
        </View>
      </PanGestureHandler>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    justifyContent: 'flex-start',
  },
  topHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  icon: {
    paddingHorizontal: 13,
  },
  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dayLabelsWrapper: {
    borderBottomWidth: 0.5,
    borderColor: '#949292',
  },
  customHeader: {
    height: 0,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8249ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
