import SegmentedControl from '../../../ui/SegmentedControl';

type OrdersFiltersProps = {
  typeFilter: 'all' | 'dinein' | 'takeaway';
  onChange: (filter: 'all' | 'dinein' | 'takeaway') => void;
  allLabel: string;
  dineInLabel: string;
  takeawayLabel: string;
};

const OrdersFilters = ({ typeFilter, onChange, allLabel, dineInLabel, takeawayLabel }: OrdersFiltersProps) => (
  <div className="w-full overflow-x-auto hide-scrollbar">
    <SegmentedControl
      options={[
        { value: 'all', label: allLabel },
        { value: 'dinein', label: dineInLabel },
        { value: 'takeaway', label: takeawayLabel },
      ]}
      selectedValue={typeFilter}
      onChange={onChange}
      className="w-full min-w-[180px] sm:min-w-0 [&_button]:flex-1 [&_button]:py-1.5 sm:[&_button]:py-2.5 [&_button]:text-xs sm:[&_button]:text-sm [&_button]:px-2 sm:[&_button]:px-4 [&_button]:whitespace-nowrap [&_button]:cursor-pointer"
    />
  </div>
);

export default OrdersFilters;