export default function PrintPreview({
  customers,
  signatory,
  postCode,
  postName,
}) {
  if (!customers || customers.length === 0) return null;

  // Generate current Thai date
  const currentDate = new Date();
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const day = currentDate.getDate();
  const month = thaiMonths[currentDate.getMonth()];
  const year = currentDate.getFullYear() + 543;
  const formattedDate = `${day} ${month} ${year}`;

  return (
    <div className="print-area" style={{ display: "none" }}>
      {customers.map((customer, index) => {
        // Pad the sequence with leading zeros (e.g., cmp001, cmp015)
        const paddedSequence = String(customer.sequence || index + 1).padStart(
          3,
          "0",
        );

        // Process post_name from the database directly
        let formattedPostName = customer.post_name || postName || "";
        formattedPostName = formattedPostName.replace(
          /^(ปณ\.|ปจ\.|ศป\.)\s*/,
          "",
        );
        const senderName = formattedPostName
          ? `ที่ทำการไปรษณีย์${formattedPostName}`
          : "ที่ทำการไปรษณีย์";

        return (
          <div key={customer.id || index} className="print-page">
            {/* Header & Logo */}
            <div className="print-logo-container">
              <img
                src="/images/thailand-post-logo.png"
                alt="Thailand Post"
                className="print-logo"
              />
            </div>
            <br />

            {/* Document Ref & Sender Address */}
            <div className="print-letter-head">
              <div className="print-ref">
                ที่ ปณท ปข.6({postCode})/cmp{paddedSequence}
              </div>
              <div className="print-sender">{senderName}</div>
            </div>
            <br />
            {/* Date */}
            <div className="print-date">{formattedDate}</div>
            <br />
            {/* Metadata: Subject, To, Enclosures */}
            <div className="print-subject-block">
              <table className="print-meta-table">
                <tbody>
                  <tr>
                    <td className="meta-label">เรื่อง</td>
                    <td>
                      การพัฒนาระบบบริการชำระค่าบริการเป็นเงินเชื่อในระบบ
                      Customer Portal (CMP)
                    </td>
                  </tr>
                  <tr>
                    <td className="meta-label">เรียน</td>
                    <td>
                      {customer.prefix ? `${customer.prefix} ` : ""}
                      {customer.customer_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="meta-label">สิ่งที่ส่งมาด้วย</td>
                    <td>
                      เอกสารแนะนำการสมัครสมาชิกในระบบ Customer Portal (CMP) (QR
                      Code แนบท้าย)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            {/* Body Text */}
            <div className="print-body-text">
              {/* prettier-ignore */}
              <p>
                ด้วย บริษัท ไปรษณีย์ไทย จำกัด (ปณท) ได้ดำเนินการพัฒนาระบบปฏิบัติการหลัก (THP Core System) เพื่อเพิ่มประสิทธิภาพในการให้บริการแก่ลูกค้า โดยได้พัฒนาระบบจัดการข้อมูลและเตรียมการฝากส่งสิ่งของสำหรับลูกค้าภายใต้ชื่อ “Customer Portal (CMP)” ซึ่งเป็นช่องทางหลักในการอำนวยความสะดวกให้แก่ผู้ใช้บริการฝากส่งจดหมายและสิ่งของแบบครบวงจร ซึ่งปัจจุบันอยู่ในขั้นตอนการนำข้อมูลของผู้ใช้บริการบรรจุเข้าในระบบ (Onboard) โดยระบบ CMP มีฟังก์ชันที่หลากหลายเพื่อสนับสนุนการดำเนินงานให้แก่หน่วยงานภาครัฐและเอกชนต่าง ๆ เช่น การเตรียมการฝากส่ง การจัดทำจ่าหน้าซอง การจัดการร้านค้า การตรวจสอบอัตราค่าบริการ การตรวจสอบสถานะสิ่งของ ตลอดจนความสามารถในการทราบยอดการใช้บริการผ่านใบแจ้งหนี้และใบเสร็จรับเงิน/ใบกำกับภาษีอิเล็กทรอนิกส์ ซึ่งจะช่วยให้การบริหารจัดการงานไปรษณียภัณฑ์และสิ่งของที่ฝากส่งของหน่วยงานของท่านเป็นไปอย่างสะดวกและรวดเร็วยิ่งขึ้น
              </p>
              {/* prettier-ignore */}
              <p>
                ในการนี้ เพื่อให้กระบวนพัฒนาระบบการให้บริการรูปแบบเดิมไปสู่ระบบการบริการรูปแบบใหม่และช่วยอำนวยความสะดวกให้หน่วยงานของท่านสามารถใช้บริการชำระค่าบริการเป็นเงินเชื่อ รวมทั้งเข้าถึงบริการต่าง ๆ ของไปรษณีย์ไทยได้อย่างต่อเนื่องและมีประสิทธิภาพ จึงใคร่ขอความอนุเคราะห์จากท่านดำเนินการ ดังนี้
              </p>
              <div className="print-list">
                <div className="print-list-item">
                  <span className="print-list-num">1.</span>
                  {/* prettier-ignore */}
                  <span className="print-list-text">
                    กำหนดผู้ประสานงานหรือผู้มีอำนาจในการฝากส่งไปรษณียภัณฑ์และสิ่งของของหน่วยงานของท่านในการดำเนินการสมัครสมาชิกและเปิดใช้บริการชำระค่าบริการเป็นเงินเชื่อในระบบ CMP โดยสามารถศึกษาข้อมูลจากเอกสารแนะนำฯ ตามสิ่งที่ส่งมาด้วย (QR Code)
                  </span>
                </div>
                <div className="print-list-item">
                  <span className="print-list-num">2.</span>
                  {/* prettier-ignore */}
                  <span className="print-list-text">
                    จัดเตรียมไฟล์เอกสารแนบประกอบการขึ้นระบบ (รูปแบบไฟล์ .pdf) เช่น สำเนาทะเบียนนิติบุคคล/ทะเบียนการค้า หรือเอกสารยืนยันการจัดตั้งหน่วยงาน หรือเอกสารอื่นใดที่รับรองว่าจัดตั้งขึ้นตามกฎหมาย หรือสำเนาทะเบียนบ้านที่ตั้งนิติบุคคล หรือสำเนาบัตรประจำตัวประชาชนผู้ยื่นคำขอ หรือหนังสือมอบอำนาจให้เป็นผู้ยื่นคำขอ
                  </span>
                </div>
              </div>
              {/* prettier-ignore */}
              <p>
                บริษัท ไปรษณีย์ไทย จำกัด (ปณท) หวังเป็นอย่างยิ่งว่าจะได้รับความอนุเคราะห์จากท่านในการดำเนินการข้างต้น เพื่อเสริมสร้างประสบการณ์การใช้บริการร่วมกันอย่างยั่งยืนและขอขอบคุณมา ณ โอกาสนี้
              </p>
            </div>
            <br />
            {/* Signature Block */}
            {signatory && (
              <div className="print-signature-block">
                <div className="print-signoff">ขอแสดงความนับถือ</div>
                <div className="print-signature-img-container">
                  {signatory.signature_url && (
                    <img
                      src={signatory.signature_url}
                      alt="ลายเซ็น"
                      crossOrigin="anonymous"
                      className="print-signature-img"
                    />
                  )}
                </div>
                <div className="print-signature-name">({signatory.name})</div>
                <div className="print-signature-position">
                  {signatory.position}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
