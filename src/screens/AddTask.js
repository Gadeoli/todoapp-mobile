import React, { Component } from 'react';
import { 
    Text,
    View,
    Modal, 
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Platform
} from 'react-native';

import commonStyles from '../commonStyles';

import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const initialState = {
    desc: '',
    date: new Date(),
    showDatePicker: false
};

export default class AddTask extends Component {

    state = {...initialState};

    getDatePicker = () => {
        let dtPicker = <DateTimePicker 
            value={this.state.date}
            onChange={(_, date) => this.setState({date, showDatePicker: false})}
            mode='date'
        />

        const dtStr = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY');

        if(Platform.OS === 'android'){
            dtPicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({showDatePicker: true})}>
                        <Text style={styles.date}>
                            {dtStr}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && dtPicker}
                </View>
            )
        }

        return dtPicker;
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        };

        this.props.onSave && this.props.onSave(newTask);

        this.setState({ ...initialState });
    }

    render() {
        const {desc} = this.state;

        return (
            <Modal 
                transparent={true} 
                visible={this.props.isVisible} 
                onRequestClose={this.props.onCancel} 
                animationType="slide"
            >
                <TouchableWithoutFeedback
                    onPress={this.props.onCancel}
                >
                    <View style={styles.background }></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova Tarefa</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Informe a descrição..."
                        value={desc}
                        onChangeText={desc => this.setState({desc})}
                    ></TextInput>
                    {this.getDatePicker()}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}><Text style={styles.button}>Cancelar</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.save}><Text style={styles.button}>Salvar</Text></TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={this.props.onCancel}
                >
                    <View style={styles.background }></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "rgba(0,0,0, .7)"
    },
    container: {
        backgroundColor: "#FFF"
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: "center",
        padding: 15,
        fontSize: 18   
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})
