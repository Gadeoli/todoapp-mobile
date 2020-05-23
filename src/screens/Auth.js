import React, {Component} from 'react';
import { 
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import backgoundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput';
import { server, showError, showSuccess } from '../common';
 
const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
};

export default class Auth extends Component{
    state = {...initialState};

    signInOrSignup = () => {
        const {stageNew} = this.state;

        if(stageNew){
            this.signup();
        }else{
            this.signin();
        }
    }

    signup = async () => {
        try{
            const {name, email, password, confirmPassword} = this.state;

            await axios.post(`${server}/signup`, {
                name,
                email,
                password,
                confirmPassword
            });

            showSuccess('Usuário cadastrado!');
            
            this.setState({...initialState});
        }catch(ex){
            showError(ex)
        }
    }

    signin = async () => {
        try{
            const {email,password} = this.state;
            const res = await axios.post(`${server}/signin`, {
                email,
                password
            });

            AsyncStorage.setItem('userData', JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`;
            this.props.navigation.navigate('Home', res.data);
        }catch(ex){
            showError(ex)
        }
    }

    render(){
        const {stageNew, name, email, password, confirmPassword} = this.state;
        const validations = [];

        validations.push(email && email.includes('@'));
        validations.push(password && password.length >= 6);

        if(stageNew){
            validations.push(confirmPassword);
            validations.push(password === confirmPassword);
            validations.push(name && name.trim().length >= 3);
        }

        const validForm = validations.reduce((t, a) => t && a);

        return (
            <ImageBackground source={backgoundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {stageNew ? ('Cria a sua conta') : ('Informe seus dados')}
                    </Text>
                    {
                        stageNew && 
                        <AuthInput 
                            icon="user" 
                            placeholder="Nome"
                            value={this.state.name}
                            style={styles.input}
                            onChangeText={(name) => this.setState({name})}
                        />
                    }

                    <AuthInput 
                        icon="at"
                        placeholder="E-mail"
                        value={this.state.email}
                        style={styles.input}
                        onChangeText={(email) => this.setState({email})}
                    />
                    <AuthInput 
                        icon="lock" 
                        placeholder="Senha"
                        value={this.state.password}
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                    />
                    {
                        stageNew && 
                        <AuthInput 
                            icon="asterisk"
                            placeholder="Confirmar Senha"
                            value={this.state.confirmPassword}
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                        />
                    }
                    <TouchableOpacity onPress={this.signInOrSignup} disabled={!validForm}>
                        <View style={[styles.buttton, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? ('Registrar') : ('Entrar')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{padding: 10}} onPress={() => this.setState({stageNew: !stageNew})}>
                    <Text style={{color: '#fff'}}>{stageNew ? 'Já possuí conta?' : 'Ainda não possuí conta?'}</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    };
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },  
    input: {    
        marginTop: 10,
        backgroundColor: '#fff',
    },
    buttton: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20
    }
});

