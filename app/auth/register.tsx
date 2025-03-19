import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import NetInfo from '@react-native-community/netinfo';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('regular');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);

  const roles = [
    { id: 'regular', label: 'Regular User' },
    { id: 'rental_shop', label: 'Rental Shop Owner' },
  ];

  // Check network connectivity on mount
  useEffect(() => {
    checkNetworkConnection();
  }, []);

  const checkNetworkConnection = async () => {
    const netInfo = await NetInfo.fetch();
    setNetworkError(!netInfo.isConnected);
  };

  const handleRegister = async () => {
    // Check network connection first
    await checkNetworkConnection();
    if (networkError) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { error: signUpError } = await signUp(email, password, role);
      
      if (signUpError) {
        setError(signUpError.message || 'Registration failed. Please try again.');
        // If it's a network error, set the network error state
        if (signUpError.message?.includes('network')) {
          setNetworkError(true);
        }
        return;
      }
      
      // Navigate to home or profile completion on successful registration
      if (role === 'rental_shop') {
        // If shop owner, they'll need to set up their shop profile
        // We'll implement this later
        router.replace('/(tabs)');
      } else {
        // Regular user
        router.replace('/(tabs)');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Type</Text>
            <TouchableOpacity
              style={styles.dropdownToggle}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text style={styles.dropdownToggleText}>
                {roles.find(r => r.id === role)?.label || 'Select Role'}
              </Text>
              {showRoleDropdown ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.dropdown}>
                {roles.map(roleOption => (
                  <TouchableOpacity
                    key={roleOption.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRole(roleOption.id);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.dropdownItemText,
                        role === roleOption.id && styles.dropdownItemTextActive
                      ]}
                    >
                      {roleOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownToggleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#007AFF',
    fontFamily: 'Inter-Medium',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#007AFF80',
  },
  registerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#007AFF',
  },
}); 