import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useSearchParams } from 'react-router-dom';

export default function Verification() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('worker');

  // Load the exact same Google Font the PHP page used (Cairo)
  useEffect(() => {
    const fontId = 'cairo-google-font';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (workerId) {
      API.get(`/workers/public/${workerId}`)
        .then(({ data }) => setWorkers([data]))
        .catch((err) => {
          console.error(err);
          setWorkers([]);
        });
    } else {
      API.get('/workers').then(({ data }) => setWorkers(data)).catch(console.error);
    }
  }, [workerId]);

  const filteredWorkers = workerId
    ? workers.filter(w => w._id === workerId && w.status === 'active')
    : workers.filter(w =>
        w.status === 'active' &&
        (w.worker_name?.toLowerCase().includes(search.toLowerCase()) ||
        w.beneficiary_no?.toLowerCase().includes(search.toLowerCase()))
      );

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Reusable row (label + value), matches PHP's .data-row
  const Row = ({ label, children }) => (
    <div className="flex items-center gap-2 py-2.5 border-b border-gray-100 last:border-b-0 text-[15px]">
      <label className="text-gray-500 font-semibold shrink-0">{label}</label>
      <span className="text-gray-900">{children}</span>
    </div>
  );

  // Reusable card (header + body), matches PHP's .card / .card-header
  const Card = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-[#1d357e] text-base">
        {title}
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );

  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
      className="min-h-screen bg-slate-50 m-0 p-0"
    >
      {/* Floating Question Mark */}
      <div className="fixed bottom-[30px] left-5 w-[55px] h-[55px] bg-[#1d357e] rounded-full flex items-center justify-center text-white text-[28px] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.3)] z-[9999] cursor-pointer leading-[0] transition-transform duration-300 hover:scale-110">
        ؟
      </div>

      {/* Copy Toast */}
      <div
        className={`fixed left-0 right-0 bg-white px-5 py-3 flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-[400ms] ease-in-out z-[10000] border-b border-gray-200 ${
          copied ? 'top-0' : '-top-[100px]'
        }`}
      >
        <div className="flex items-center gap-3 w-full justify-between">
          <span
            className="text-gray-400 text-[22px] cursor-pointer font-bold"
            onClick={() => setCopied(false)}
          >
            ×
          </span>
          <span className="text-gray-700 text-base font-semibold">تم نسخ الرابط</span>
          <div className="bg-[#2ecc71] text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
            ✓
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex flex-col gap-[5px] cursor-pointer">
          <span className="block w-6 h-[3px] bg-[#1d357e] rounded"></span>
          <span className="block w-6 h-[3px] bg-[#1d357e] rounded"></span>
          <span className="block w-6 h-[3px] bg-[#1d357e] rounded"></span>
        </div>
        <img src="/ajeer.PNG" alt="Ajeer" className="h-10 w-auto" />
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6 leading-relaxed">
          تصريح أجير لحلول الموارد <br />
          البشرية
        </h1>

        {!workerId && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="ابحث باسم الموظف أو رقم المنشأة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        )}

        {filteredWorkers.map((worker) => (
          <div key={worker._id}>
            {worker.status === 'hidden' && workerId ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-bold mb-4">
                ⚠️ تحذير: هذا السجل مخفي أو غير نشط حاليًا!
              </div>
            ) : (
              <div id="real-data">
                <Card title="معلومات التصريح">
                  <Row label="اسم الموظف:">{worker.worker_name}</Row>
                  <Row label="حالة التصريح:">
                    <span className="bg-[#52be80] text-white px-2 py-1 rounded text-sm">
                      {worker.permit_status || 'ساري'}
                    </span>
                  </Row>
                  <Row label="تاريخ بداية التصريح:">{worker.start_date}</Row>
                  <Row label="تاريخ إنتهاء التصريح:">{worker.expiry_date}</Row>
                </Card>

                <Card title="المنشأة المستفيدة">
                  <Row label="اسم المنشأة:">{worker.beneficiary_name}</Row>
                  <Row label="رقم المنشأة:">{worker.beneficiary_no}</Row>
                </Card>

                <Card title="شركة الإستقدام">
                  <Row label="اسم المنشأة:">{worker.recruitment_company}</Row>
                  <Row label="رقم المنشأة:">{worker.recruitment_no}</Row>
                </Card>

                <button
                  onClick={copyLink}
                  className="w-full mt-2 p-[14px] bg-blue-900 text-white font-bold rounded-md cursor-pointer border-none hover:bg-blue-800 transition"
                >
                  نسخ رابط الصفحة 🔗
                </button>
              </div>
            )}
          </div>
        ))}

        {workerId &&
          filteredWorkers.length === 0 &&
          workers.some((w) => w._id === workerId && w.status === 'hidden') && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-bold">
              ⚠️ تحذير: هذا السجل مخفي أو غير نشط حاليًا!
            </div>
          )}

        {!workerId && filteredWorkers.length === 0 && (
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500">
            لا توجد نتائج
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center px-5 py-10 bg-white border-t border-gray-100">
        <img src="/ajeer.PNG" alt="Ajeer" className="w-20 mx-auto mb-5" />
        <div className="flex flex-col gap-3 mb-5">
          <a href="#" className="text-slate-500 no-underline text-sm">سياسات الخصوصية</a>
          <a href="#" className="text-slate-500 no-underline text-sm">الشروط والأحكام</a>
        </div>
        <p className="text-slate-500 text-sm mb-5">© ١٤٤٧ / أجير حلول الموارد البشرية</p>
        <div className="font-semibold text-slate-800 mb-6 block">🌐 English</div>
        <div className="flex items-center justify-center">
          <img src="/ajeer.PNG" className="hidden" />
          <img src="/takaml.PNG" alt="takaml" className="h-[60px] w-auto" />
        </div>
      </footer>
    </div>
  );
}