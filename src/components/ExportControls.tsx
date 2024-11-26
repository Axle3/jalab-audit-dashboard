import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { generateCSV, RecordData, filterDataByDateRange } from '@/utils/csvExport';
import { useToast } from '@/components/ui/use-toast';

interface ExportControlsProps {
  data: RecordData[];
}

const ExportControls = ({ data }: ExportControlsProps) => {
  const [exportType, setExportType] = useState<'daily' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const handleExport = () => {
    try {
      let filteredData: RecordData[] = [];
      let filename = '';

      switch (exportType) {
        case 'daily':
          filteredData = filterDataByDateRange(data, startDate, startDate);
          filename = `daily-report-${format(startDate, 'yyyy-MM-dd')}`;
          break;
        case 'monthly':
          const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
          filteredData = filterDataByDateRange(data, monthStart, monthEnd);
          filename = `monthly-report-${format(startDate, 'yyyy-MM')}`;
          break;
        case 'custom':
          filteredData = filterDataByDateRange(data, startDate, endDate);
          filename = `custom-report-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}`;
          break;
      }

      generateCSV(filteredData, filename);
      toast({
        title: "Export Successful",
        description: `Data has been exported to ${filename}.csv`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting the data.",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold">Export Data</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={exportType} onValueChange={(value: 'daily' | 'monthly' | 'custom') => setExportType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select export type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Report</SelectItem>
            <SelectItem value="monthly">Monthly Report</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {exportType === 'custom' ? 'Start Date' : 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {exportType === 'custom' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                End Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        <Button onClick={handleExport}>
          Export to CSV
        </Button>
      </div>
    </div>
  );
};

export default ExportControls;