const passengers = [
    {
        pnrCode: "VN7891",
        passengerName: "NGUYEN VAN AN",
        idNumber: "001200012345",
        flightNumber: "VN220",
        seatNumber: "12A",
        isCheckedIn: true
    },
    {
        pnrCode: "VN7892",
        passengerName: "TRAN THI MAI",
        idNumber: "B1234567",
        flightNumber: "VN220",
        seatNumber: "12B",
        isCheckedIn: true
    },
    {
        pnrCode: "VN7893",
        passengerName: "LE QUANG DUC",
        idNumber: "038095009876",
        flightNumber: "VN220",
        seatNumber: "",
        isCheckedIn: false
    },
    {
        pnrCode: "VN7894",
        passengerName: "PHAM HOANG LONG",
        idNumber: "C98765432",
        flightNumber: "VJ152",
        seatNumber: "",
        isCheckedIn: false
    }
];

const AVAILABLE_SEATS = [
    "12A", "12B", "12C", "12D",
    "14A", "14B", "14C", "14D",
    "15A", "15B", "15C", "15D",
    "16A", "16B", "16C", "16D"
];

function validateIdentity(idNumber) {
    if (typeof idNumber !== "string") return false;
    const cleanId = idNumber.trim().toUpperCase();
    const cccdRegex = /^\d{12}$/;
    const passportRegex = /^[A-Z]\d{7,8}$/;
    return cccdRegex.test(cleanId) || passportRegex.test(cleanId);
}

function findPassengerByPnr(pnrCode) {
    if (!pnrCode || typeof pnrCode !== "string") return null;
    const cleanPnr = pnrCode.trim().toUpperCase();
    return passengers.find(p => p.pnrCode.toUpperCase() === cleanPnr) || null;
}

function allocateSeat(flightNumber) {
    const occupiedSeats = passengers
        .filter(p => p.flightNumber.toUpperCase() === flightNumber.toUpperCase() && p.seatNumber)
        .map(p => p.seatNumber.toUpperCase());

    for (const seat of AVAILABLE_SEATS) {
        if (!occupiedSeats.includes(seat.toUpperCase())) {
            return seat;
        }
    }
    return null;
}

function printBoardingPass(passenger) {
    const pnr = passenger.pnrCode.padEnd(10);
    const name = passenger.passengerName.padEnd(26);
    const flight = passenger.flightNumber.padEnd(8);
    const seat = passenger.seatNumber.padEnd(6);
    const id = passenger.idNumber.padEnd(16);

    console.log("==================================================================");
    console.log("                      BOARDING PASS / THẺ LÊN TÀU BAY             ");
    console.log("==================================================================");
    console.log(` PASSENGER : ${name} PNR   : ${pnr}`);
    console.log(` FLIGHT    : ${flight} SEAT  : ${seat}`);
    console.log(` ID NUMBER : ${id} GATE  : 04 (T1) `);
    console.log("------------------------------------------------------------------");
    console.log(" BARCODE: ||||| | |||| || ||||| ||| || |||||| || ||||| ||| |||||||");
    console.log(`          *${passenger.pnrCode}*${passenger.seatNumber}*                 `);
    console.log("==================================================================");
}

function displayPassengerRecords() {
    console.log("\n--- HỒ SƠ HÀNH KHÁCH & TÌNH TRẠNG CHUYẾN BAY ---");
    const formattedList = passengers.map(p => ({
        "Mã PNR": p.pnrCode,
        "Họ và Tên": p.passengerName,
        "Số CCCD / Hộ chiếu": p.idNumber,
        "Chuyến bay": p.flightNumber,
        "Số ghế": p.seatNumber || "(Chưa cấp)",
        "Đã Check-in": p.isCheckedIn ? "YES" : "NO"
    }));
    console.table(formattedList);
}

function registerPassenger() {
    const pnrCode = prompt("Nhập mã PNR mới (ví dụ: VN9901):");
    if (!pnrCode || !pnrCode.trim()) {
        alert("Lỗi: Mã PNR không được để trống!");
        return;
    }

    if (findPassengerByPnr(pnrCode)) {
        alert("Lỗi: Mã PNR đã tồn tại trong hệ thống!");
        return;
    }

    const passengerName = prompt("Nhập tên hành khách (không dấu):");
    if (!passengerName || !passengerName.trim()) {
        alert("Lỗi: Tên hành khách không được để trống!");
        return;
    }

    const idNumber = prompt("Nhập số CCCD (12 số) hoặc Hộ chiếu (1 chữ cái + 7-8 số):");
    if (!idNumber || !validateIdentity(idNumber)) {
        alert("Lỗi: Số CCCD hoặc Hộ chiếu không đúng quy chuẩn!");
        return;
    }

    const flightNumber = prompt("Nhập mã số chuyến bay (ví dụ: VN220):");
    if (!flightNumber || !flightNumber.trim()) {
        alert("Lỗi: Mã chuyến bay không được để trống!");
        return;
    }

    const newPassenger = {
        pnrCode: pnrCode.trim().toUpperCase(),
        passengerName: passengerName.trim().toUpperCase(),
        idNumber: idNumber.trim().toUpperCase(),
        flightNumber: flightNumber.trim().toUpperCase(),
        seatNumber: "",
        isCheckedIn: false
    };

    passengers.push(newPassenger);
    alert(`Đã tiếp nhận hồ sơ thành công cho hành khách ${newPassenger.passengerName}!`);
}

function processSecurityCheckIn() {
    const pnrInput = prompt("Nhập mã PNR để kiểm tra hồ sơ và làm thủ tục check-in:");
    if (!pnrInput || !pnrInput.trim()) {
        alert("Lỗi: Mã PNR không được để trống!");
        return;
    }

    const passenger = findPassengerByPnr(pnrInput);
    if (!passenger) {
        alert(`Lỗi: Không tìm thấy hồ sơ hành khách với mã PNR "${pnrInput.trim().toUpperCase()}".`);
        return;
    }

    if (passenger.isCheckedIn) {
        alert(`Hành khách ${passenger.passengerName} đã hoàn tất check-in trước đó (Ghế: ${passenger.seatNumber}).`);
        printBoardingPass(passenger);
        return;
    }

    const idInput = prompt(`Xác thực giấy tờ cho khách ${passenger.passengerName}\nNhập số CCCD hoặc Hộ chiếu:`);
    if (!idInput) {
        alert("Quy trình check-in bị hủy.");
        return;
    }

    if (!validateIdentity(idInput)) {
        alert("Lỗi an ninh: Giấy tờ tùy thân không đúng định dạng chuẩn!");
        return;
    }

    if (idInput.trim().toUpperCase() !== passenger.idNumber.toUpperCase()) {
        alert("Cảnh báo an ninh: Số giấy tờ tùy thân KHÔNG khớp với thông tin đặt vé!");
        return;
    }

    const assignedSeat = allocateSeat(passenger.flightNumber);
    if (!assignedSeat) {
        alert(`Lỗi: Chuyến bay ${passenger.flightNumber} đã hết ghế trống! Không thể hoàn tất check-in.`);
        return;
    }

    passenger.seatNumber = assignedSeat;
    passenger.isCheckedIn = true;

    alert(`Xác thực an ninh thành công! Đã cấp phát ghế ${assignedSeat} cho hành khách.`);
    printBoardingPass(passenger);
}

function main() {
    let running = true;

    do {
        const menu = 
            "====================================================\n" +
            "  HỆ THỐNG QUẢN LÝ HỒ SƠ HÀNH KHÁCH & CHECK-IN SÂN BAY\n" +
            "====================================================\n" +
            "1. Xem danh sách hồ sơ hành khách\n" +
            "2. Tiếp nhận hồ sơ hành khách mới\n" +
            "3. Xác thực an ninh, cấp ghế & In thẻ lên tàu\n" +
            "4. Thoát hệ thống\n" +
            "----------------------------------------------------\n" +
            "Nhập lựa chọn của bạn (1-4):";

        const choice = prompt(menu);

        if (choice === null) {
            const confirmExit = confirm("Bạn có chắc chắn muốn đóng phiên làm việc?");
            if (confirmExit) {
                running = false;
                break;
            } else {
                continue;
            }
        }

        switch (choice.trim()) {
            case "1":
                displayPassengerRecords();
                break;
            case "2":
                registerPassenger();
                break;
            case "3":
                processSecurityCheckIn();
                break;
            case "4":
                alert("Đang đóng phiên làm việc. Hệ thống dừng hoạt động.");
                running = false;
                break;
            default:
                alert("Lựa chọn không hợp lệ! Vui lòng chọn từ 1 đến 4.");
                break;
        }
    } while (running);

    console.log("Phiên làm việc đã kết thúc.");
}

main();