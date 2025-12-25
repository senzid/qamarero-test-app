'use client';

import { useState, useMemo, useEffect } from 'react';
import type { BillData } from '@/lib/types';
import Card from './Card';
import GoToPayment from './GoToPayment';
import PeopleSection from './PeopleSection';
import { useSplitData } from '@/lib/use-split-data';
import { formatCurrency } from '@/lib/format-currency';

interface Person {
  id: string;
  name: string;
}

export default function EqualSplitter({ billData }: { billData: BillData }) {
  const { saveSplitData } = useSplitData();
  
  const getInitialPeople = (): Person[] => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('qamarero-split-data');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.type === 'split-equal' && data.people && data.people.length > 0) {
            return data.people;
          }
        }
      } catch (e) {
        console.error('Error loading initial state:', e);
      }
    }
    return [
      { id: '1', name: 'Persona 1' },
      { id: '2', name: 'Persona 2' },
    ];
  };

  const [people, setPeople] = useState<Person[]>(getInitialPeople);

  const calculations = useMemo(() => {
    const grandTotal = billData.items.reduce(
      (sum, item) => sum + (item.qty * item.unitPrice),
      0
    );
    const perPerson = people.length > 0 ? grandTotal / people.length : 0;
    
    return {
      grandTotal,
      perPerson,
    };
  }, [billData.items, people.length]);

  useEffect(() => {
    const personTotals: { [personId: string]: number } = {};
    people.forEach(person => {
      personTotals[person.id] = calculations.perPerson;
    });

    saveSplitData({
      type: 'split-equal',
      tableId: billData.table.id,
      people,
      personTotals,
      grandTotal: calculations.grandTotal,
      currency: billData.currency,
    });
  }, [people, calculations, billData.currency, saveSplitData,billData.table.id]);

  const addPerson = () => {
    const newId = String(people.length + 1);
    setPeople([...people, { id: newId, name: `Persona ${newId}` }]);
  };

  const updatePersonName = (id: string, name: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p));
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople(people.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <PeopleSection
        people={people}
        onAddPerson={addPerson}
        onUpdatePersonName={updatePersonName}
        onRemovePerson={removePerson}
      />

      <Card>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Resumen
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-slate-700">
                Total de la cuenta:
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(calculations.grandTotal, billData.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-300">
              <span className="text-lg font-medium text-slate-700">
                Por persona ({people.length}):
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(calculations.perPerson, billData.currency)}
              </span>
            </div>
          </div>
        </div>
      </Card>


      <GoToPayment type="split-equal" />

    </div>
  );
}

