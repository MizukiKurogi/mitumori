document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('estimate-form');
  const planRadios = document.getElementsByName('plan');
  const optionsDiv = document.getElementById('options');
  const checkboxes = optionsDiv.querySelectorAll('input[type="checkbox"]');
  const totalDisplay = document.getElementById('total');
  
  // オプション名の判定用
  const optionLabels = Array.from(checkboxes).map(cb => cb.parentElement.textContent);

  // 基本料金の設定
  const BASE_PRICES = {
    monitor: 1980,
    standard: 3980
  };

  // 選択可能なオプションvalue値
  const ENABLED_OPTIONS = {
    monitor: ["2000"], // 北海道・沖縄のみ
    standard: ["1500", "500", "2000"] // 緊急・撥水・北海道沖縄
  };

  function calculateTotal() {
    let total = 0;
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    
    // 基本料金の加算
    total += BASE_PRICES[selectedPlan];

    // オプション料金の加算
    checkboxes.forEach((cb) => {
      const enabled = ENABLED_OPTIONS[selectedPlan].includes(cb.value);
      if (enabled && cb.checked) {
        total += parseInt(cb.value);
      }
    });

    totalDisplay.textContent = total.toLocaleString();
  }

  // プラン選択時の処理
  planRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedPlan = radio.value;
      // オプション欄は常に表示
      optionsDiv.style.display = 'block';
      checkboxes.forEach((cb) => {
        const enabled = ENABLED_OPTIONS[selectedPlan].includes(cb.value);
        if (!enabled) {
          cb.checked = false;
          cb.disabled = true;
        } else {
          cb.disabled = false;
        }
      });
      calculateTotal();
    });
  });

  // オプション選択時の処理
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', calculateTotal);
  });

  // 初期表示時の合計金額計算とdisabled反映
  planRadios.forEach((radio) => {
    if (radio.checked) {
      radio.dispatchEvent(new Event('change'));
    }
  });
}); 
