import React, { useMemo } from 'react';
import { Sale } from '../types';
import Card from './Card';
import SalesChart from './SalesChart';

interface DashboardProps {
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales }) => {
    const { totalRevenue, totalSales, averageSaleValue, salesByDate } = useMemo(() => {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalSales = sales.length;
        const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

        const salesByDate = sales.reduce((acc, sale) => {
            const date = sale.date;
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += sale.total;
            return acc;
        }, {} as Record<string, number>);

        return { totalRevenue, totalSales, averageSaleValue, salesByDate };
    }, [sales]);

  const chartData = Object.keys(salesByDate)
    .sort((a,b) => new Date(a).getTime() - new Date(b).getTime())
    .map(date => ({
        name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: salesByDate[date],
    }));
    
  const recentSales = [...sales].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Revenue">
          <p className="text-4xl font-bold text-positive">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card title="Total Sales">
          <p className="text-4xl font-bold text-gray-100">{totalSales}</p>
        </Card>
        <Card title="Average Sale Value">
          <p className="text-4xl font-bold text-positive">${averageSaleValue.toFixed(2)}</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card title="Revenue Over Time">
                <div className="h-80">
                   <SalesChart data={chartData} />
                </div>
            </Card>
        </div>
        <div>
            <Card title="Recent Transactions">
                <div className="space-y-4">
                    {recentSales.map(sale => (
                        <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-200">{sale.id}</p>
                                <p className="text-sm text-gray-400">{new Date(sale.date).toLocaleDateString()}</p>
                            </div>
                            <p className="font-bold text-lg text-positive">${sale.total.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;