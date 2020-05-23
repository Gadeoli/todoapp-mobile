import React, {Component} from 'react';
import {
    View, 
    Text, 
    ImageBackground, 
    StyleSheet, 
    FlatList,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';

import commonStyles from '../commonStyles';
import Task from '../components/Task';
import AddTask from './AddTask';
import {server, showError, showSuccess} from '../common';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';


const initialState = {
    tasks: [],
    visibleTasks: [],
    showDoneTasks: true,
    showAddTaskModal: false
}

export default class TaskList extends Component{
    state = {
        ...initialState
    };

    componentDidMount = async () => {
        // this.filterTasks();
        const stateStr = await AsyncStorage.getItem('tasksState');
        const savedState = JSON.parse(stateStr) || initialState;
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        }, this.filterTasks);

        this.loadTasks();
    }

    toogleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
    }

    toogleTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toogle`);
            this.loadTasks();
        } catch (er) {
            showError(er);
        }
    }

    filterTasks = () => {
        const {showDoneTasks, tasks} = this.state;
        let visibleTasks = null;
        
        if(showDoneTasks){
            visibleTasks = [...tasks];
        }else{
            const pending = (task) => task.doneAt === null; 
            visibleTasks = tasks.filter(pending);
        }

        this.setState({visibleTasks})

        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }));
    }

    addTask = async (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados inválidos', 'Descrição não informada');
            return;
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            });
        } catch (er) {
            showError(er);
        }

        this.setState({ showAddTaskModal: false }, this.loadTasks);
    }

    deleteTask = async (taskId) => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`);
            this.loadTasks();
        } catch (er) {
            showError(er);
        }
    }

    loadTasks = async () => {
        try{
            const maxDate = moment().add({days: this.props.daysAhead})
                                    .format('YYYY-MM-DD 23:59:59');
            const res = await axios.get(`${server}/tasks?date=${maxDate}`);

            this.setState({ tasks: res.data }, this.filterTasks);
        }catch(ex){
            showError(ex)
        }
    }

    getImageDate = () => {
        switch (this.props.daysAhead) {
            case 0: return todayImage; break;
            case 1: return tomorrowImage; break;
            case 7: return weekImage; break;
            default: return monthImage; break;
        }
    }

    getColor = () => {
        switch (this.props.daysAhead) {
            case 0: return commonStyles.colors.today; break;
            case 1: return commonStyles.colors.tomorrow; break;
            case 7: return commonStyles.colors.week; break;
            default: return commonStyles.colors.month; break;
        }
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
        const {
            showDoneTasks, 
            visibleTasks,
            showAddTaskModal
        } = this.state;

        return (    
            <View style={styles.container}>
                <AddTask 
                    isVisible={showAddTaskModal}
                    onCancel={() => this.setState({showAddTaskModal: !showAddTaskModal})}   
                    onSave={this.addTask} 
                />
                <ImageBackground source={this.getImageDate()} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="bars" color={commonStyles.colors.secondary} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toogleFilter}>
                            <Icon name={showDoneTasks ? "eye" : "eye-slash"} color={commonStyles.colors.secondary} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList 
                        data={visibleTasks} 
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task 
                            {...item} 
                            onToogleTask={this.toogleTask} 
                            onDelete={this.deleteTask}    
                        />}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.addButton, {backgroundColor: this.getColor()}]} 
                    onPress={() => this.setState({showAddTaskModal: !showAddTaskModal})} 
                    activeOpacity={0.7}
                >
                    <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },  
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar: {
        flexDirection: "row",
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        alignItems: "center",
        justifyContent: "center"
    }
})