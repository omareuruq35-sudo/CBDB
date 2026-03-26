import './locations.css';
import { MapPin, Phone } from 'lucide-react';

export default function LocationsPage() {
  const governorates = [
    {
      name: "الإسكندرية",
      address: "154 شارع السوق (باكوس)",
      phones: ["0123456789", "0123456789"]
    },
    {
      name: "الإسماعيلية",
      address: "ميدان المطافي",
      phones: ["0123456789", "0123456789"]
    },
    {
      name: "القاهرة",
      address: "فاقوس - محطة العزازي",
      phones: ["0123456789", "0123456789"]
    },
    {
      name: "المنوفية",
      address: "شبين الكوم - شارع جمال عبد الناصر",
      phones: ["0123456789", "0123456789"]
    },
    {
      name: "الغربية",
      address: "المجمع الطبي (شارع البحر)",
      phones: ["0123456789", "0123456789"]
    }
  ];

  return (
    <div className="locations-page">
      {/* العناوين الرئيسية */}
      <header className="page-header">
        <h1 className="main-title">أماكن بنوك الدم بالمحافظات</h1>
        <p className="sub-title">دليل شامل لأماكن بنوك الدم في جميع المحافظات لتسهيل الوصول إليها عند الحاجة</p>
      </header>

      {/* قائمة المحافظات */}
      <div className="locations-list">
        {governorates.map((gov, index) => (
          <div key={index} className="location-card">
            
            {/* اسم المحافظة مع الخط الأحمر الصغير من فيجما */}
            <div className="gov-name-section">
              <span className="red-line"></span>
              <h2 className="gov-name">{gov.name}</h2>
            </div>

            {/* سيكشن العنوان */}
            <div className="address-box">
              <div className="icon-wrapper">
                <MapPin size={20} color="#E02323" />
                <span className="box-label">العنوان:</span>
              </div>
              <p className="address-text">{gov.address}</p>
            </div>

            {/* سيكشن التليفون */}
            <div className="phone-box">
              <div className="icon-wrapper">
                <Phone size={20} color="#E02323"  /> {/* لو عاوزه اشبع علامة الموبايل هحط ده جنب اللي مكتوبfill="#E02323" */}
                <span className="box-label">التليفون:</span>
              </div>
              <ul className="phone-list">
                {gov.phones.map((phone, i) => (
                  <li key={i} className="phone-item">
                    <span className="red-dot"></span>
                    {phone}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

     <p className="emergency-call">
  للطوارئ يرجى الاتصال على الرقم <span className="number-highlight">123</span>
</p>
    </div>
  );
}