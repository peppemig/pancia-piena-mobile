import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import DashboardCard from "../../components/dashboard/DashboardCard";
import statsService from "../../api/statsService";
import { useState, useEffect } from "react";
import LoadingState from "../../components/LoadingState";
import { Stats } from "../../types/types";
import errorAlert from "../../components/errorAlert";
import { useAuthState } from "../../providers/AuthProvider";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { checkSameDay } from "../../utils/utils";
import RecentOrderRow from "../../components/dashboard/RecentOrderRow";
import Button from "../../components/ui/Button";
import { logOut } from "../../config/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Dashboard = () => {
  const { user } = useAuthState();
  const router = useRouter();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    new Date()
  );
  const [stats, setStats] = useState<Stats>();
  const [ordersForTheDay, setOrdersForTheDay] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const year = calendarDate!.getFullYear();
  const month = calendarDate!.getMonth() + 1;
  const day = calendarDate!.getDate();

  const date = new Date(year, month - 1, day);
  const formattedMonthYear = format(date, "MMMM yyyy", { locale: it });
  const formattedDayMonthYear = format(date, "d MMMM yyyy", { locale: it });

  const logout = () => {
    logOut()
      .then(() => router.replace("/"))
      .catch(() => errorAlert("Prova ad effettuare nuovamente il logout"));
  };

  const onLogout = () => {
    Alert.alert(
      "Logout",
      "Sei sicuro di voler effettuare il logout?",
      [
        {
          text: "Si",
          style: "default",
          onPress: () => logout(),
        },
        {
          text: "Chiudi",
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const getStats = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        statsService
          .getStats(token, year, month)
          .then((res) => {
            setStats(res.data.stats);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            errorAlert("Prova ad effettuare nuovamente la richiesta");
          });
      })
      .catch(() => {
        setIsLoading(false);
        errorAlert("Prova ad effettuare nuovamente la richiesta");
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getStats();
      return () => {
        setCalendarDate(new Date());
        isActive = false;
      };
    }, [user])
  );

  useEffect(() => {
    if (stats) {
      const dayOrders = stats.graphStats.find(
        (item) => checkSameDay(new Date(item.day), calendarDate!) === true
      );
      setOrdersForTheDay(dayOrders?.ordersForTheDay);
    }
  }, [stats, calendarDate]);

  useEffect(() => {
    getStats();
  }, [user, month, year]);

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setCalendarDate(date);
    hideDatePicker();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <Button
        label={formattedDayMonthYear}
        variant="secondary"
        onPress={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <ScrollView contentContainerStyle={{ gap: 6 }}>
        {stats && Object.keys(stats).length > 0 && (
          <>
            <DashboardCard
              type="currency"
              label="Totale guadagni"
              desc={formattedMonthYear}
              value={stats.monthTotal._sum.totalPrice || 0}
            />
            <DashboardCard
              type="stat"
              label="Totale ordini"
              desc={formattedMonthYear}
              value={stats.graphStats.reduce(
                (total, item) => total + item.ordersForTheDay,
                0
              )}
            />
            <DashboardCard
              type="stat"
              label="Ordini oggi"
              desc={formattedDayMonthYear}
              value={ordersForTheDay || 0}
            />
            <View style={styles.recenOrdersContainer}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Ordini recenti
              </Text>
              {stats.last5Orders.map((order) => (
                <RecentOrderRow
                  key={order.id}
                  tableNumber={order.tableNumber}
                  totalPrice={order.totalPrice}
                />
              ))}
            </View>
          </>
        )}
        <Button onPress={onLogout} label="Logout" variant="primary" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    backgroundColor: "white",
  },
  recenOrdersContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default Dashboard;
