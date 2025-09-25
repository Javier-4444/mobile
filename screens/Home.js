import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, StatusBar } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  const handleLogOut = async () => {
    try {
      await signOut(auth);  
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.replace('Login');  
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  // Datos de ejemplo para las órdenes
  const kitchenOrders = [
    { id: 77, status: 'Pendiente' },
    { id: 18, status: 'En preparación' },
    { id: 19, status: 'Pendiente' },
    { id: 20, status: 'Listo' },
    { id: 21, status: 'Pendiente' },
    { id: 22, status: 'En preparación' },
    { id: 23, status: 'Pendiente' },
  ];

  const TabButton = ({ iconName, title, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.tabButtonActive]} 
      onPress={onPress}
    >
      <FontAwesome 
        name={iconName} 
        size={24} 
        color={isActive ? "#FD002A" : "#666"} 
      />
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      
      
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>SANTO PECADO</Text>
          <Text style={styles.headerRole}>Bienvenido, ADMINISTRADOR</Text>
        </View>
        <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#FD002A" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Métricas */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Métricas</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>12</Text>
              <Text style={styles.metricLabel}>Productos Vendidos</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>2</Text>
              <Text style={styles.metricLabel}>Stock Mínimo</Text>
            </View>
          </View>
        </View>

        {/* Ingresos de hoy */}
        <View style={styles.incomeContainer}>
          <Text style={styles.sectionTitle}>Ingresos de hoy</Text>
          <View style={styles.incomeCard}>
            <Text style={styles.incomeAmount}>$ 125.000</Text>
          </View>
        </View>

        {/* Órdenes de Cocina */}
        <View style={styles.ordersContainer}>
          <View style={styles.ordersHeader}>
            <Text style={styles.sectionTitle}>Órdenes de Cocina</Text>
            <TouchableOpacity style={styles.createOrderButton}>
              <Text style={styles.createOrderText}>Crear Comanda</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersList}>
            {kitchenOrders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <Text style={styles.orderNumber}>#{order.id}</Text>
                <View style={[
                  styles.orderStatus, 
                  order.status === 'Listo' && styles.statusReady,
                  order.status === 'En preparación' && styles.statusPreparing
                ]}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
  <TabButton 
    iconName="shopping-basket" 
    title="Caja" 
    isActive={activeTab === 'caja'} 
    onPress={() => setActiveTab('caja')} 
  />
  <TabButton 
    iconName="credit-card" 
    title="Compra" 
    isActive={activeTab === 'compra'} 
    onPress={() => setActiveTab('compra')} 
  />
  <TabButton 
    iconName="home" 
    title="Inicio" 
    isActive={activeTab === 'home'} 
    onPress={() => setActiveTab('home')} 
  />
  <TabButton 
    iconName="dollar" 
    title="Venta" 
    isActive={activeTab === 'venta'} 
    onPress={() => setActiveTab('venta')} 
  />
  <TabButton 
    iconName="cubes" 
    title="Stock" 
    isActive={activeTab === 'stock'} 
    onPress={() => setActiveTab('stock')} 
  />
  <TabButton 
    iconName="ellipsis-h" 
    title="Más" 
    isActive={activeTab === 'mas'} 
    onPress={() => setActiveTab('mas')} 
  />
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FD002A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  headerRole: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  metricsContainer: {
    marginBottom: 25,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FD002A',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  incomeContainer: {
    marginBottom: 25,
  },
  incomeCard: {
    backgroundColor: '#1a1a1a',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  incomeAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ordersContainer: {
    marginBottom: 25,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  createOrderButton: {
    backgroundColor: '#FD002A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createOrderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ordersList: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  statusReady: {
    backgroundColor: '#4CAF50',
  },
  statusPreparing: {
    backgroundColor: '#FF9800',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#FD002A',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FD002A',
    fontWeight: 'bold',
  },
});




