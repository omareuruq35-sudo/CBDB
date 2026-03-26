import './services.css'; 
import Image from 'next/image'; // استدعاء مكون الصور من Next.js

export default function ServicesPage() {
  return (     
    <div className="donation-page  py-10">
      <div className="conditions-container max-w-[1077px] mx-auto p-5">
        <h2 className="section-title text-right text-2xl font-bold mb-8 text-black">شروط التبرع بالدم</h2>
        
        <div className="content-card flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100">
          
          {/* النصوص على اليمين */}
          <div className="text-content flex-1 p-10 text-right space-y-6 order-2 md:order-1">
            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">العمر:</span>
              <p className="value text-gray-700 mr-4">من 18 إلى 60 عاماً.</p>
            </div>
            
            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">الوزن:</span>
              <p className="value text-gray-700 mr-4">ألا يقل عن 50 كيلوجراماً.</p>
            </div>

            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">الحالة الصحية:</span>
              <p className="value text-gray-700 mr-4">يجب أن يكون المتبرع بصحة جيدة وخالٍ من الأمراض الحادة والمزمنة غير المعالجة.</p>
            </div>

            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">الضغط والسكر:</span>
              <p className="value text-gray-700 mr-4">مستوى الضغط والسكر يجب أن يكون ضمن الحدود الطبيعية أو تحت متابعة طبية.</p>
            </div>
            
            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">الحمل والرضاعة:</span>
              <p className="value text-gray-700 mr-4">لا يسمح للمرأة الحامل بالتبرع. يفضل الانتظار حتى انتهاء فترة الرضاعة.</p>
            </div>

            <div className="condition-group">
              <span className="label font-bold text-lg block text-black border-r-4 border-[#E02323] pr-3">التبرعات السابقة:</span>
              <p className="value text-gray-700 mr-4">يفصل بين كل تبرع وآخر مدة زمنية معيارية: للرجال 3 أشهر وللنساء 4 أشهر.</p>
            </div>
          </div>
          
          {/* مكان الصورة الثابتة */}
          <div className="image-section flex-1 bg-gray-50 flex items-center justify-center p-5 order-1 md:order-2">
             <div className="w-full h-[500px] relative rounded-md overflow-hidden shadow-inner">
                <img 
                  src="/blood-donation-rules.png" // هنا تكتبي اسم الصورة اللي حطيتيها في فولدر public
                  alt="شروط التبرع بالدم"
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}