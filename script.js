// Đợi DOM load xong hoàn toàn mới thực thi code
document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // TRANG DEBUG: XỬ LÝ SỬA LỖI ĐOẠN MÃ
  // ==========================================
  let btnDebug = document.getElementById("23010001_btn_save");
  if (btnDebug) {
    /* SỬA LỖI CHÍNH: Thay vì viết saveDate() (gây tự động chạy hàm khi vừa load trang),
           chúng ta bỏ dấu () đi, chỉ ghi là saveDate để truyền tham chiếu hàm vào event.
        */
    btnDebug.addEventListener("click", saveDate);
  }

  function saveDate() {
    console.log("Dữ liệu đã được lưu lúc: " + new Date());
    alert("Thành công");
  }

  // ==========================================
  // TRANG QUẢN LÝ: XỬ LÝ FORM & RÀNG BUỘC MSSV
  // ==========================================
  const mealForm = document.getElementById("mealForm");
  const mealTableBody = document.getElementById("mealTableBody");
  const totalCaloriesEl = document.getElementById("totalCalories");
  const lifestyleAlert = document.getElementById("lifestyleAlert");

  // Mảng lưu trữ danh sách món ăn để dễ quản lý dữ liệu và tính toán
  let mealList = [];

  mealForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn trang web tải lại khi submit form

    // Lấy dữ liệu từ các input form
    const studentId = document.getElementById("studentId").value.trim();
    const foodName = document.getElementById("foodName").value.trim();
    const calories = parseInt(document.getElementById("calories").value);
    const mealTime = document.getElementById("mealTime").value;

    // Tạo một đối tượng chứa thông tin món ăn vừa nhập
    const newMeal = {
      studentId: studentId,
      foodName: foodName,
      calories: calories,
      mealTime: mealTime,
    };

    // --- BIỆN PHÁP RÀNG BUỘC ĐỊNH DANH (MSSV CHẴN / LẺ) ---
    // Lấy ký tự cuối cùng của chuỗi MSSV và chuyển sang số nguyên
    const lastDigit = parseInt(studentId.slice(-1));

    if (isNaN(lastDigit)) {
      alert("Mã số sinh viên phải kết thúc bằng một chữ số!");
      return;
    }

    if (lastDigit % 2 !== 0) {
      // MSSV Kết thúc bằng số LẺ -> Chèn bản ghi vào ĐẦU mảng (unshift)
      mealList.unshift(newMeal);
    } else {
      // MSSV Kết thúc bằng số CHẴN -> Chèn bản ghi vào CUỐI mảng (push)
      mealList.push(newMeal);
    }

    // Cập nhật lại giao diện bảng và tính tổng calo
    renderTable();

    // Xóa sạch form sau khi thêm thành công để người dùng nhập tiếp
    mealForm.reset();
  });

  // Hàm đảm nhận việc vẽ lại bảng dữ liệu HTML từ mảng JS
  function renderTable() {
    // Xóa trắng bảng hiện tại
    mealTableBody.innerHTML = "";
    let totalCalories = 0;

    // Duyệt qua mảng để tạo các thẻ <tr> gắn vào bảng
    mealList.forEach((meal) => {
      totalCalories += meal.calories;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td><span class="badge bg-secondary">${meal.studentId}</span></td>
                <td class="fw-bold text-dark">${meal.foodName}</td>
                <td><span class="badge bg-info text-dark">${meal.mealTime}</span></td>
                <td class="text-end text-success fw-bold">${meal.calories.toLocaleString()} kcal</td>
            `;
      mealTableBody.appendChild(row);
    });

    // Hiển thị tổng Calo hàng ngày xuống phần tfoot
    totalCaloriesEl.textContent = `${totalCalories.toLocaleString()} kcal`;

    // --- TÍNH NĂNG BỔ SUNG: KIỂM TRA SỐ MÓN ĂN > 10 ---
    if (mealList.length > 10) {
      lifestyleAlert.classList.remove("d-none"); // Hiện thông báo
    } else {
      lifestyleAlert.classList.add("d-none"); // Ẩn thông báo nếu chưa đủ 10 món
    }
  }
});
