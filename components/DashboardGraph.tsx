import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_URL } from '@/config';
import { CumulativeSpending } from '@/interfaces/spending';

interface Props {
  refresh: boolean;
}

const DashboardGraph: React.FC<Props> = ({ refresh }) => {
  const [spending, setSpending] = useState<CumulativeSpending[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/Student/CumulativeSpending`);
        setSpending(response.data.data);
      } catch (error) {
        console.error("Error on DashboardGraph.tsx", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const formatDate = (dateString: string) => {
    const options = { month: 'short', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formattedData = {
    labels: spending.map((item) => formatDate(item.date)).slice(0, 7).reverse(),
    datasets: [
      {
        data: spending.map((item) => item.totalSpending).slice(0, 7).reverse(),
      },
    ],
  };

  return (
    <View style={{}}>
      <Text style={styles.title}>Weekly Cumulative Spending</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#84d761" />
      ) : spending.length > 0 ? (
        <BarChart
          data={formattedData}
          width={Dimensions.get('window').width - 40} // Padding adjustment
          height={250} // Increase the height for a larger graph
          yAxisLabel="RM"
          yAxisSuffix=""
          withInnerLines={false}
          yAxisInterval={1}
          showValuesOnTopOfBars={true}
          chartConfig={{
            backgroundColor: '#f8f8f8', // Use a light gray background
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `#84d761`, // Change line color to a nice green
            labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`, // Change label color to dark gray
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5', // Slightly smaller dot radius
              strokeWidth: '2',
              stroke: '#84d761', // Change dot color to match the line color
            },
          }}
          style={{
            marginVertical: 16, // Increase vertical margin for spacing
            borderRadius: 16,
            paddingHorizontal: 10, // Add horizontal padding
          }}
          verticalLabelRotation={0} // Rotate labels for better readability
        />
      ) : (
        <Text style={styles.noDataText}>No spending data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default DashboardGraph;
