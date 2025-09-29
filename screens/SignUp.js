import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para modales personalizados
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validaciones de correo
  const isValidEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  };

  // Validaciones de contraseña
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const passwordStrengthValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  const isPasswordValid = passwordStrengthValid && passwordsMatch;

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Todos los campos son obligatorios.");
      setShowErrorModal(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("El formato del correo electrónico no es válido. Verifica el dominio.");
      setShowErrorModal(true);
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Por favor, cumple con todos los requisitos de la contraseña.");
      setShowErrorModal(true);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowSuccessModal(true);
    } catch (error) {
      let errorMessageText = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessageText = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessageText = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessageText = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessageText = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      setErrorMessage(errorMessageText);
      setShowErrorModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  const PasswordRequirement = ({ met, text }) => (
    <View style={styles.requirementContainer}>
      <FontAwesome
        name={met ? "check-circle" : "circle"}
        size={16}
        color={met ? "#4CAF50" : "#ccc"}
      />
      <Text style={[styles.requirementText, { color: met ? "#4CAF50" : "#ccc" }]}>
        {text}
      </Text>
    </View>
  );

  const getPasswordBorderColor = () => {
    if (password.length === 0) return '#ff0000ff'; 
    return passwordStrengthValid ? '#4CAF50' : '#ccc'; 
  };

  const getConfirmPasswordBorderColor = () => {
    if (confirmPassword.length === 0) return '#ff0000ff'; 
    return passwordsMatch ? '#4CAF50' : '#ccc';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require('../assets/letras-santo-pecado.jpg')} style={styles.logo} resizeMode='contain' />
          <Text style={styles.title}>REGISTRATE AHORA</Text>

          <Text style={styles.label}>Nombre</Text>
          <View style={[styles.inputContainer, { borderColor: '#ff0000ff' }]}>
            <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su nombre"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <Text style={styles.label}>Apellido</Text>
          <View style={[styles.inputContainer, { borderColor: '#ff0000ff' }]}>
            <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su apellido"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <Text style={styles.label}>Correo</Text>
          <View style={[styles.inputContainer, { borderColor: '#ff0000ff' }]}>
            <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su correo"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: getPasswordBorderColor() }]}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirement}>Debe tener al menos: </Text>
            <PasswordRequirement met={hasMinLength} text="Mas de 5 caracteres" />
            <PasswordRequirement met={hasUpperCase} text="Una mayuscula" />
            <PasswordRequirement met={hasLowerCase} text="Una minuscula" />
            <PasswordRequirement met={hasNumber} text="Un numero" />
          </View>

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={[styles.inputContainer, { borderColor: getConfirmPasswordBorderColor() }]}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirme su contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          {confirmPassword.length > 0 && (
            <View style={styles.requirementsContainer}>
              <PasswordRequirement
                met={passwordsMatch}
                text={passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, !isPasswordValid && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={!isPasswordValid}
          >
            <Text style={[styles.buttonText, !isPasswordValid && styles.buttonTextDisabled]}>
              Registrarse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleErrorClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleErrorClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡Registro exitoso!</Text>
            <Text style={styles.modalMessage}>Usuario registrado con éxito.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleSuccessClose}>
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
    color: '#fff'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0000ff',
    borderRadius: 8,
    backgroundColor: '#323743',
    marginBottom: 15,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  icon: {
    width: 25,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ff0000ff',
    borderRadius: 8,
    backgroundColor: '#323743',
    color: '#fff',
    paddingHorizontal: 10,
    marginHorizontal: 10
  },
  requirementsContainer: {
    width: '100%',
    marginBottom: 10,
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  requirement: {
    color: '#9b9b9bff'
  },
  button: {
    backgroundColor: '#FD002A',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#FF6B8B',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#E0E0E0',
  },
  signUpText: {
    marginTop: 20,
    color: '#FD002A',
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0000ff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#FD002A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



