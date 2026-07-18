import { Package, Calendar, MapPin, Truck, Download } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { exportOrders } from '@/utils';
import { ORDER_STATUSES } from '@/constants';

interface OrderManagementProps {
  onBack: () => void;
}

// 订单状态到StatusBadge颜色映射
const ORDER_STATUS_COLOR: Record<string, 'success' | 'warn' | 'danger'> = {
  pending: 'warn',
  processing: 'warn',
  shipped: 'warn',
  completed: 'success',
  cancelled: 'danger',
};

export default function OrderManagement({ onBack }: OrderManagementProps) {
  const orders = useStore((state) => state.orders);
  const { isAdmin, isProvincial } = useAuth();
  const canExport = isAdmin || isProvincial;

  const getStatusLabel = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string): 'success' | 'warn' | 'danger' => {
    return ORDER_STATUS_COLOR[status] || 'warn';
  };

  const handleExport = () => {
    const ok = exportOrders(orders, { filename: '订单报表' });
    if (!ok) {
      useStore.setState({ globalError: '暂无数据可导出' });
    }
  };

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="订单管理" showBack onBack={onBack} />

      <div className="px-4 py-4">
        {canExport && orders.length > 0 && (
          <div className="flex justify-end mb-3">
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download size={14} className="mr-1" />
              导出报表
            </Button>
          </div>
        )}
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-rock-blue" />
                  <span className="text-sm font-medium text-carbon-black">订单号：{order.id}</span>
                </div>
                <StatusBadge
                  label={getStatusLabel(order.status)}
                  color={getStatusColor(order.status)}
                  size="sm"
                />
              </div>
              <div className="mb-3">
                <h4 className="text-sm text-steel-gray">{order.productName}</h4>
                <p className="text-xs text-steel-light-gray mt-1">
                  数量：{order.quantity}㎡ × ¥{order.unitPrice}/{order.productName.includes('SDC') ? '㎡' : '件'}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-steel-light-gray">合计：</span>
                  <span className="text-rock-blue font-bold">¥{order.totalPrice.toLocaleString()}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-steel-light-gray">
                  <Calendar size={12} />
                  {order.createdAt}
                </span>
              </div>
              {order.deliveryAddress && (
                <div className="mt-3 pt-3 border-t border-steel-light-gray">
                  <p className="text-sm text-steel-gray flex items-start gap-2">
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
