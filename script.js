const datePicker = document.getElementById('datePicker');
const resultTableBody = document.getElementById('resultTableBody');
const imageContainer = document.getElementById('image-container');
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('img01');
const closeBtn = document.getElementsByClassName('close')[0];

function displayResults(results) {
    resultTableBody.innerHTML = '';
    imageContainer.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.状态}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.次数}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.最低燃弧状态评分}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.平均燃弧状态评分}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.最长发生时间}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700">${result.平均发生时间}</td>
            <td class="border-b border-gray-200 p-3 text-sm text-gray-700 hidden-column">${result.发生时间区间}</td>
        `;
        resultTableBody.appendChild(row);

        // 自动判断：优先读视频地址，没有就用图片地址
        let mediaList = [];
        if(result.视频地址 && result.视频地址.length>0){
            mediaList = result.视频地址;
        }else if(result.图片地址 && result.图片地址.length>0){
            mediaList = result.图片地址;
        }

        mediaList.forEach((src, index) => {
            const mediaContainer = document.createElement('div');
            mediaContainer.classList.add('image-item');

            let mediaEl;
	   if(result.视频地址){
    mediaEl = document.createElement('video');
    mediaEl.src = src;
    mediaEl.controls = true;
    mediaEl.muted = true;
    mediaEl.preload = "metadata";
    mediaEl.playsInline = true;  // 手机端兼容必备
    mediaEl.style.maxWidth = '100%';
    mediaEl.style.height = 'auto';
    mediaEl.style.display = 'block';
}
            else{
                // 图片元素（保留原有弹窗逻辑）
                mediaEl = document.createElement('img');
                mediaEl.src = src;
                mediaEl.alt = '结果图片';
                mediaEl.style.maxWidth = '100%';
                mediaEl.style.height = 'auto';
                mediaEl.style.display = 'block';
                mediaEl.style.cursor = 'pointer';
                mediaEl.addEventListener('click', function () {
                    modal.style.display = 'block';
                    modalImg.src = this.src;
                });
            }
            mediaContainer.appendChild(mediaEl);

            // 保留原来的文字信息（第1/2/3次燃弧评估）
            let infoText = '';
            if (index === 0 && result.燃弧状态评分1 && result.燃弧时长评分1 ) {
                infoText = `第一次燃弧综合评估：\n燃弧状态评分: ${result.燃弧状态评分1}\n燃弧时长评分: ${result.燃弧时长评分1}`;
            } else if (index === 1 && result.燃弧状态评分2 && result.燃弧时长评分2 ) {
                infoText = `第二次燃弧综合评估：\n燃弧状态评分: ${result.燃弧状态评分2}\n燃弧时长评分: ${result.燃弧时长评分2}`;
            } else if (index === 2 && result.燃弧状态评分3 && result.燃弧时长评分3 ) {
                infoText = `第三次燃弧综合评估：\n燃弧状态评分: ${result.燃弧状态评分3}\n燃弧时长评分: ${result.燃弧时长评分3}`;
            }

            if (infoText) {
                const info = document.createElement('p');
                info.textContent = infoText;
                info.classList.add('image-info');
                mediaContainer.appendChild(info);
            }

            imageContainer.appendChild(mediaContainer);
        });
    });

    if (imageContainer.children.length === 0) {
        imageContainer.style.display = 'none';
    } else {
        imageContainer.style.display = 'flex';
    }
}

function loadData() {
    fetch('experiment_data.json')
      .then(response => response.json())
      .then(data => {
            datePicker.addEventListener('change', function () {
                const selectedDate = this.value;
                const dateData = data.filter(item => item.发生时间区间.split(' - ')[0].startsWith(selectedDate));
                displayResults(dateData);
            });

            const dates = data.map(item => item.发生时间区间.split(' - ')[0].split(' ')[0]);
            const earliestDate = dates.sort()[0];
            datePicker.value = earliestDate;
            const initialData = data.filter(item => item.发生时间区间.split(' - ')[0].startsWith(earliestDate));
            displayResults(initialData);
        })
      .catch(error => console.error('Error fetching data:', error));
}

closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

loadData();