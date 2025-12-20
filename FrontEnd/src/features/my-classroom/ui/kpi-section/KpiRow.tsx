import KpiCard from './KpiCard';
import { useQuery } from '@tanstack/react-query';
import { kpiQueries } from '@/entities/kpi';
import { LoadingSpinner } from '@/shared';

export default function KpiRow() {
  const { data, isLoading, isError, error } = useQuery(kpiQueries.kpiData());

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600">{error?.message || 'KPI 데이터를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-600">표시할 KPI 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-nowrap gap-5 overflow-x-auto">
      {data.map(kpi => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
