import { useMemo, useState } from 'react';

type VehicleCategory = 'All' | 'SUV' | 'Sedan' | 'Hybrid' | 'Sport';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  category: Exclude<VehicleCategory, 'All'>;
  price: number;
  mileage: number;
  transmission: string;
  fuelEconomy: string;
  badge?: string;
  imageUrl: string;
}

const INVENTORY: Vehicle[] = [
  {
    id: 'av-101',
    brand: 'Nissan',
    model: 'Juke',
    trim: 'Nismo RS Turbo',
    year: 2024,
    category: 'SUV',
    price: 23900,
    mileage: 4200,
    transmission: '7-Speed DCT',
    fuelEconomy: '32 MPG Combined',
    badge: 'Low Mileage',
    imageUrl:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'av-102',
    brand: 'Fiat',
    model: '500',
    trim: 'Lounge Edition',
    year: 2024,
    category: 'Sedan',
    price: 18500,
    mileage: 6800,
    transmission: '6-Speed Auto',
    fuelEconomy: '38 MPG Combined',
    badge: 'City Pick',
    imageUrl:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'av-103',
    brand: 'BMW',
    model: 'M4',
    trim: 'Competition Coupe',
    year: 2024,
    category: 'Sport',
    price: 68400,
    mileage: 3100,
    transmission: '8-Speed M Steptronic',
    fuelEconomy: '23 MPG Combined',
    badge: 'Hot Deal',
    imageUrl:
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'av-104',
    brand: 'Toyota',
    model: 'Camry',
    trim: 'XSE Hybrid',
    year: 2025,
    category: 'Hybrid',
    price: 31900,
    mileage: 5200,
    transmission: 'eCVT Hybrid',
    fuelEconomy: '47 MPG Combined',
    badge: 'Eco Pick',
    imageUrl:
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'av-105',
    brand: 'Chevrolet',
    model: 'Corvette',
    trim: 'Stingray Z51',
    year: 2024,
    category: 'Sport',
    price: 64200,
    mileage: 4900,
    transmission: '8-Speed Dual-Clutch',
    fuelEconomy: '24 MPG Combined',
    badge: '1-Owner',
    imageUrl:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'av-106',
    brand: 'Porsche',
    model: '911',
    trim: 'Carrera S',
    year: 2024,
    category: 'Sport',
    price: 112800,
    mileage: 2400,
    transmission: '8-Speed PDK',
    fuelEconomy: '22 MPG Combined',
    badge: 'Certified',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
];

export function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<VehicleCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>(
    'featured'
  );
  const [savedIds, setSavedIds] = useState<string[]>(['av-101']);

  // Financing Modal State
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(
    INVENTORY[0]
  );
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanMonths, setLoanMonths] = useState<number>(60);
  const [apr, setApr] = useState<number>(7.9);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = INVENTORY.filter((car) => {
      const matchesCategory =
        selectedCategory === 'All' || car.category === selectedCategory;
      const matchesQuery =
        !query ||
        `${car.brand} ${car.model} ${car.trim} ${car.year}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const financeSummary = useMemo(() => {
    if (!activeVehicle) return null;
    const downPayment = Math.round(
      (activeVehicle.price * downPaymentPct) / 100
    );
    const financedAmount = activeVehicle.price - downPayment;
    const monthlyRate = apr / 100 / 12;

    const monthlyPayment =
      monthlyRate > 0
        ? (financedAmount * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -loanMonths))
        : financedAmount / loanMonths;

    const totalPayable = monthlyPayment * loanMonths;
    const totalInterest = Math.max(0, totalPayable - financedAmount);

    return {
      downPayment,
      financedAmount,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(downPayment + totalPayable),
    };
  }, [activeVehicle, downPaymentPct, loanMonths, apr]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const handleOpenQuote = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setLeadSubmitted(false);
  };

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-zinc-950 shadow-lg shadow-amber-500/20">
              AV
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                AutoVault
              </span>
              <span className="ml-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                Certified Showroom & Financing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-300">
              Saved Vehicles:{' '}
              <strong className="text-amber-400">{savedIds.length}</strong>
            </span>
            <span className="hidden rounded-lg bg-emerald-500/10 px-3 py-2 font-medium text-emerald-400 sm:inline-block">
              Instant Pre-Approval Available
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Filter & Search Bar */}
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Certified Pre-Owned & New Inventory
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Filter vehicles in real time and generate customized monthly
                financing quotes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search brand, model, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none sm:w-64"
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'featured' | 'price-asc' | 'price-desc'
                  )
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              ['All', 'SUV', 'Sedan', 'Hybrid', 'Sport'] as VehicleCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Main Split Layout: Vehicle Grid + Live Financing Workbench */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Inventory Cards */}
          <section className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
              <span>
                Showing{' '}
                <strong className="text-white">{filteredVehicles.length}</strong>{' '}
                available vehicles
              </span>
              <span>Click any vehicle to calculate payment</span>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
                <p className="text-base font-semibold text-white">
                  No matching vehicles found
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Try clearing your search filter or selecting another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredVehicles.map((car) => {
                  const isActive = activeVehicle?.id === car.id;
                  const isSaved = savedIds.includes(car.id);
                  const estMonthly = Math.round((car.price * 0.8) / 52);

                  return (
                    <article
                      key={car.id}
                      onClick={() => handleOpenQuote(car)}
                      className={`group cursor-pointer overflow-hidden rounded-2xl border transition ${
                        isActive
                          ? 'border-amber-500 bg-zinc-900 shadow-lg shadow-amber-500/10'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-zinc-800">
                        <img
                          src={car.imageUrl}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {car.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-zinc-950/85 px-2.5 py-1 text-[11px] font-semibold text-amber-400 backdrop-blur">
                            {car.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(car.id);
                          }}
                          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur transition ${
                            isSaved
                              ? 'bg-amber-500 text-zinc-950'
                              : 'bg-zinc-950/80 text-zinc-200 hover:bg-zinc-900'
                          }`}
                        >
                          {isSaved ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-amber-400">
                              {car.year} • {car.category}
                            </p>
                            <h2 className="text-base font-bold text-white">
                              {car.brand} {car.model}
                            </h2>
                            <p className="text-xs text-zinc-400">{car.trim}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-extrabold text-white">
                              {formatMoney(car.price)}
                            </p>
                            <p className="text-[11px] text-emerald-400">
                              Est. {formatMoney(estMonthly)}/mo
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3 text-[11px] text-zinc-400">
                          <span>{car.mileage.toLocaleString()} mi</span>
                          <span>{car.transmission}</span>
                          <span>{car.fuelEconomy}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Sticky Financing Calculator */}
          <aside className="lg:col-span-5">
            {activeVehicle && financeSummary && (
              <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      Live Financing Simulator
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {activeVehicle.year} {activeVehicle.brand}{' '}
                      {activeVehicle.model}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {activeVehicle.trim} — Cash Price:{' '}
                      <strong className="text-white">
                        {formatMoney(activeVehicle.price)}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Monthly Payment Highlight Box */}
                <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                  <p className="text-xs font-medium text-amber-300">
                    Estimated Monthly Payment
                  </p>
                  <p className="mt-1 text-3xl font-black text-white">
                    {formatMoney(financeSummary.monthlyPayment)}
                    <span className="text-sm font-normal text-zinc-300">
                      /mo
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {loanMonths} months at {apr.toFixed(1)}% APR with{' '}
                    {formatMoney(financeSummary.downPayment)} down
                  </p>
                </div>

                {/* Sliders */}
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-zinc-300">
                        Down Payment ({downPaymentPct}%)
                      </span>
                      <span className="font-semibold text-amber-400">
                        {formatMoney(financeSummary.downPayment)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      step={5}
                      value={downPaymentPct}
                      onChange={(e) =>
                        setDownPaymentPct(Number(e.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-zinc-300">Loan Term</span>
                      <span className="font-semibold text-amber-400">
                        {loanMonths} Months ({(loanMonths / 12).toFixed(1)} Yrs)
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[36, 48, 60, 72].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanMonths(term)}
                          className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                            loanMonths === term
                              ? 'bg-amber-500 text-zinc-950'
                              : 'border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600'
                          }`}
                        >
                          {term} mo
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-zinc-300">Estimated APR</span>
                      <span className="font-semibold text-amber-400">
                        {apr.toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3.5}
                      max={15.5}
                      step={0.4}
                      value={apr}
                      onChange={(e) => setApr(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-amber-500"
                    />
                  </div>
                </div>

                {/* Loan Breakdown */}
                <div className="mt-5 space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Amount Financed:</span>
                    <span className="font-medium text-white">
                      {formatMoney(financeSummary.financedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Interest ({loanMonths} mo):</span>
                    <span className="font-medium text-amber-400">
                      {formatMoney(financeSummary.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 pt-2 text-zinc-200">
                    <span className="font-semibold">Total Loan + Down:</span>
                    <span className="font-bold text-white">
                      {formatMoney(financeSummary.totalCost)}
                    </span>
                  </div>
                </div>

                {/* Instant Quote Lead Form */}
                {leadSubmitted ? (
                  <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
                    <p className="text-sm font-bold text-emerald-400">
                      Quote Locked for {clientName}!
                    </p>
                    <p className="mt-1 text-xs text-zinc-300">
                      Our finance advisor will contact {clientPhone} with your{' '}
                      {formatMoney(financeSummary.monthlyPayment)}/mo pre-approval
                      sheet.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestQuote} className="mt-5 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
                    >
                      Lock This Payment & Request Quote
                    </button>
                  </form>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;