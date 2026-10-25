// solution_ex7.js
const readlineSync = require("readline-sync");

// 1. Dữ liệu cấu hình gói cước
const PLAN_CONFIG = {
  PERSONAL: { name: "PERSONAL", deviceLimit: 1, price: 59000 },
  FAMILY: { name: "FAMILY", deviceLimit: 4, price: 149000 }
};

// 2. Khởi tạo mảng subscriptions mẫu
let subscriptions = [
  { id: "SUB_001", customerName: "Nguyen Van A", plan: "PERSONAL", deviceLimit: 1, price: 59000, status: "ACTIVE" },
  { id: "SUB_002", customerName: "Tran Thi B", plan: "FAMILY", deviceLimit: 4, price: 149000, status: "ACTIVE" },
  { id: "SUB_003", customerName: "Le Van C", plan: "PERSONAL", deviceLimit: 1, price: 59000, status: "ACTIVE" }
];

let nextIdCounter = 4;

// 3. Hàm tiện ích sinh mã thuê bao tự động
function generateSubscriptionId() {
  const paddedId = String(nextIdCounter++).padStart(3, "0");
  return `SUB_${paddedId}`;
}

// 4. Hàm hiển thị danh sách (Read)
function listSubscriptions() {
  console.log("\n=================== DANH SÁCH THUÊ BAO RIKKEISTREAM ===================");
  if (subscriptions.length === 0) {
    console.log("Hiện tại không có thuê bao nào trong hệ thống.");
    return;
  }
  console.table(subscriptions);
}

// 5. Hàm thêm mới thuê bao (Create)
function addSubscription() {
  console.log("\n--- THÊM MỚI THUÊ BAO ---");
  const customerName = readlineSync.question("Nhập tên khách hàng: ").trim();
  if (!customerName) {
    console.log("Lỗi: Tên khách hàng không được để trống!");
    return;
  }

  const plans = ["PERSONAL", "FAMILY"];
  const planIndex = readlineSync.keyInSelect(plans, "Chọn gói cước:", { cancel: false });
  const selectedPlanKey = plans[planIndex];
  const planDetails = PLAN_CONFIG[selectedPlanKey];

  const newSub = {
    id: generateSubscriptionId(),
    customerName,
    plan: planDetails.name,
    deviceLimit: planDetails.deviceLimit,
    price: planDetails.price,
    status: "ACTIVE"
  };

  subscriptions.push(newSub);
  console.log(`Thêm thành công thuê bao [${newSub.id}] cho khách hàng "${customerName}".`);
}

// 6. Hàm cập nhật gói cước (Update)
function updateSubscription() {
  console.log("\n--- CẬP NHẬT GÓI CƯỚC THUÊ BAO ---");
  const targetId = readlineSync.question("Nhập mã thuê bao cần cập nhật (VD: SUB_001): ").trim().toUpperCase();

  const sub = subscriptions.find(item => item.id === targetId);
  if (!sub) {
    console.log(`Lỗi: Không tìm thấy thuê bao có mã [${targetId}].`);
    return;
  }

  console.log(`Thông tin hiện tại: ${sub.customerName} | Gói: ${sub.plan} | Thiết bị tối đa: ${sub.deviceLimit}`);
  const plans = ["PERSONAL", "FAMILY"];
  const planIndex = readlineSync.keyInSelect(plans, "Chọn gói cước mới:", { cancel: "Hủy bỏ cập nhật" });

  if (planIndex === -1) {
    console.log("Đã hủy thao tác cập nhật.");
    return;
  }

  const newPlanKey = plans[planIndex];
  const newPlanDetails = PLAN_CONFIG[newPlanKey];

  sub.plan = newPlanDetails.name;
  sub.deviceLimit = newPlanDetails.deviceLimit;
  sub.price = newPlanDetails.price;

  console.log(`Cập nhật thành công thuê bao [${sub.id}] sang gói [${sub.plan}].`);
}

// 7. Hàm hủy/xóa thuê bao (Delete)
function deleteSubscription() {
  console.log("\n--- HỦY/XÓA THUÊ BAO ---");
  const targetId = readlineSync.question("Nhập mã thuê bao cần hủy (VD: SUB_001): ").trim().toUpperCase();

  const index = subscriptions.findIndex(item => item.id === targetId);
  if (index === -1) {
    console.log(`Lỗi: Không tìm thấy thuê bao có mã [${targetId}].`);
    return;
  }

  const isConfirmed = readlineSync.keyInYNStrict(`Bạn có chắc chắn muốn hủy thuê bao [${targetId}] của ${subscriptions[index].customerName}?`);
  if (!isConfirmed) {
    console.log("Đã hủy thao tác xóa.");
    return;
  }

  const removed = subscriptions.splice(index, 1);
  console.log(`Đã hủy và xóa thành công thuê bao [${removed[0].id}].`);
}

// 8. Hàm hiển thị menu và điều hướng luồng chính
function main() {
  let menuChoice = 0;

  do {
    console.log("\n==============================================");
    console.log("       HỆ THỐNG QUẢN LÝ THUÊ BAO RIKKEISTREAM  ");
    console.log("==============================================");
    console.log("1. Thêm thuê bao mới");
    console.log("2. Xem toàn bộ danh sách thuê bao");
    console.log("3. Cập nhật gói cước");
    console.log("4. Hủy thuê bao");
    console.log("5. Thoát chương trình");
    console.log("----------------------------------------------");

    menuChoice = readlineSync.questionInt("Nhập lựa chọn của bạn (1-5): ");

    switch (menuChoice) {
      case 1:
        addSubscription();
        break;
      case 2:
        listSubscriptions();
        break;
      case 3:
        updateSubscription();
        break;
      case 4:
        deleteSubscription();
        break;
      case 5:
        console.log("\nĐang đóng phiên làm việc... Cảm ơn bạn đã sử dụng RikkeiStream CLI!");
        break;
      default:
        console.log("Lựa chọn không hợp lệ. Vui lòng nhập số từ 1 đến 5.");
        break;
    }

    if (menuChoice !== 5) {
      readlineSync.question("\nNhấn Enter để quay lại Menu chính...");
    }
  } while (menuChoice !== 5);
}

main();