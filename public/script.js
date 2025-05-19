document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('estimate-form');
  const planRadios = document.getElementsByName('plan');
  const optionsDiv = document.getElementById('options');
  const checkboxes = optionsDiv.querySelectorAll('input[type="checkbox"]');
  const totalDisplay = document.getElementById('total');
  
  // 基本料金の設定
  const BASE_PRICES = {
    monitor: 1980,
    standard: 3980
  };

  function calculateTotal() {
    let total = 0;
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    
    // 基本料金の加算
    total += BASE_PRICES[selectedPlan];

    // オプション料金の加算
    if (selectedPlan === 'standard') {
      checkboxes.forEach((cb) => {
        if (cb.checked) total += parseInt(cb.value);
      });
    } else if (selectedPlan === 'monitor') {
      // モニタープランの場合、北海道・沖縄のみ選択可能
      const remoteCheckbox = Array.from(checkboxes).find(cb => 
        cb.parentElement.textContent.includes('北海道・沖縄')
      );
      if (remoteCheckbox && remoteCheckbox.checked) {
        total += parseInt(remoteCheckbox.value);
      }
    }

    totalDisplay.textContent = total.toLocaleString();
  }

  // プラン選択時の処理
  planRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const isStandard = radio.value === 'standard';
      optionsDiv.style.display = isStandard ? 'block' : 'none';

      // モニタープランの場合、北海道・沖縄以外のオプションを無効化
      checkboxes.forEach((cb) => {
        const isRemote = cb.parentElement.textContent.includes('北海道・沖縄');
        if (!isStandard) {
          if (!isRemote) {
            cb.checked = false;
            cb.disabled = true;
          } else {
            cb.disabled = false;
          }
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

  // フォーム送信時の処理
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      plan: formData.get('plan'),
      name: formData.get('name'),
      notes: formData.get('notes'),
      options: Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => ({
          name: cb.parentElement.textContent.trim(),
          price: parseInt(cb.value)
        })),
      total: parseInt(totalDisplay.textContent)
    };

    // ここでデータを送信する処理を実装
    console.log('送信データ:', data);
    alert('見積もりを受け付けました。\n担当者より折り返しご連絡いたします。');
    form.reset();
    calculateTotal();
  });

  // 初期表示時の合計金額計算
  calculateTotal();
}); 