import { Package, Calendar, MapPin, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';
import { ORDER_STATUSES } from '@/constants';

interface OrderManagementProps {
  onBack: () => void;
}

export default function OrderManagement({ onBack }: OrderManagementProps) {
  const orders = useStore((state) => state.orders);

  const getStatusLabel = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="min-h-screen bg-yaozhiyan-gray-50 pb-20">
      <Header title="订单管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-yaozhiyan-primary" />
                  <span className="text-sm font-medium text-yaozhiyan-gray-800">订单号：{order.id}</span>
                </div>
                <span className="px-2 py-0.5 bg-yaozhiyan-primary/10 text-yaozhiyan-primary text-xs rounded">
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="mb-3">
                <h4 className="text-sm text-yaozhiyan-gray-700">{order.productName}</h4>
                <p className="text-xs text-yaozhiyan-gray-500 mt-1">
                  数量：{order.quantity}㎡ × ¥{order.unitPrice}/{order.productName.includes('SDC') ? '㎡' : '件'}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-yaozhiyan-gray-500">合计：</span>
                  <span className="text-yaozhiyan-primary font-bold">¥{order.totalPrice.toLocaleString()}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-yaozhiyan-gray-400">
                  <Calendar size={12} />
                  {order.createdAt}
                </span>
              </div>
              {order.deliveryAddress && (
                <div className="mt-3 pt-3 border-t border-yaozhiyan-gray-100">
                  <p className="text-sm text-yaozhiyan-gray-600 flex items-start gap-2">
                    <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                    收货地址：{order.deliveryAddress}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}