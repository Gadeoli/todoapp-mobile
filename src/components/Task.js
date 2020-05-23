import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../commonStyles';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import moment from 'moment';
import 'moment/locale/pt-br';

export default props => {

    const doneOrNotStyle = props.doneAt != null ? 
        {textDecorationLine: 'line-through'} : {};

    const date = props.doneAt || props.estimateAt;
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM');

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name="trash" size={30} color="#FFF"/>
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <TouchableOpacity style={styles.left}>
                <Icon name="trash" size={20} color="#FFF" style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Swipeable
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.onToogleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt){
    return doneAt ? (
        <View style={styles.done}><Text><Icon name='check' size={20} color="#FFF" /></Text></View>
    ) : (
        <View style={styles.pending}></View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: "#FFF"
    },
    checkContainer: {
        width: "20%",
        alignItems: "center",
        justifyContent: "center"
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: "#4d7031",
        alignItems: "center",
        justifyContent: "center"
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: "#FFF",
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
});