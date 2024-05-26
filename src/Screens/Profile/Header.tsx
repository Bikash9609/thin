import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearProgressGeneric from '../../components/LinearProgress';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthProvider';

interface HeaderProps {
  onAddNewContent: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddNewContent, isLoading }) => {
  const { navigate } = useNavigation() as any;
  const { logout } = useAuth();
  const styles = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    logout().then(() => setModalVisible(false));
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={() => navigate('Home')}>
          <View style={styles.leftContent}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.title}>Dashboard</Text>
          </View>
        </Pressable>
        <View style={styles.rightContent}>
          <TouchableOpacity onPress={onAddNewContent} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add new</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && <LinearProgressGeneric />}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white',
    paddingBottom: s(5),
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    color: theme.text.dark.black,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.bold,
  },
  addButton: {
    backgroundColor: theme.colors.blue[600],
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderRadius: s(5),
    marginRight: s(10),
  },
  addButtonText: {
    color: 'white',
    fontSize: s(theme.fontSizes.base - 2),
    ...theme.fontWeights.bold,
  },
  menuButton: {
    padding: s(5),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: s(20),
    borderRadius: s(10),
    alignItems: 'center',
  },
  modalTitle: {
    color: theme.text.dark.deepGray,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.bold,
    marginBottom: s(10),
  },
  logoutButton: {
    backgroundColor: theme.colors.red[600],
    paddingVertical: s(10),
    paddingHorizontal: s(20),
    borderRadius: s(5),
    marginBottom: s(10),
    width: '100%',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: s(theme.fontSizes.base - 2),
    ...theme.fontWeights.bold,
  },
  closeButton: {
    paddingVertical: s(10),
    paddingHorizontal: s(20),
    borderRadius: s(5),
    backgroundColor: theme.colors.gray[200],
    width: '100%',
  },
  closeButtonText: {
    color: theme.text.dark.deepGray,
    fontSize: s(theme.fontSizes.base - 2),
    ...theme.fontWeights.bold,
  },
}));

export default Header;
