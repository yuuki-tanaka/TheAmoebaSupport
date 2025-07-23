/**
 * 勤務実績報告画面へ(z)ボタン
 * @returns {HTMLButtonElement}
 */
const DIRECT_WORK_SCREEN_BUTTON = () => {
    let directWorkScreenBtn = document.createElement('button');
    directWorkScreenBtn.type = 'button';
    directWorkScreenBtn.textContent = '勤務実績報告画面へ(z)';
    directWorkScreenBtn.accessKey = 'z';
    directWorkScreenBtn.className = 'btn btn-custom';
    return directWorkScreenBtn;
}

/**
 * ログインページか判定
 * @returns {boolean}
 */
const isLoginPage = () => {
    const pageID = document.getElementById('MenuIDData');
    const loginEle = document.getElementById('Login_Page');

    if (pageID == null || loginEle == null) {
        return false;
    }

    if (pageID.value != '') {
        return false;
    }
    return true;
}

/**
 * リクエストパラメータの設定 \
 * データがあればデフォルトを使用、なければ任意の値を設定する
 * @param {string} name 
 * @param {*} value 
 */
const setParam = (name, value) => {
    const elm = document.getElementsByName(name)[0];
    if (elm) {
        elm.value = value;
    } else {
        const newElm = document.createElement("input");
        newElm.type = "hidden";
        newElm.name = name;
        newElm.value = value;
        document.getElementsByTagName("form")[0].appendChild(newElm);
    }
}

/**
 * 勤怠の対象日を取得する
 * @returns {string}
 */
const getTargetDate = () => {
    const dt = new Date();
    dt.setDate(dt.getDate() - (dt.getDay() == 1 ? 3 : 1));
    const zp = (num, kt) => ("0".repeat(kt) + num).slice(-kt);
    const ymd = zp(dt.getFullYear(), 4) + "/" + zp(dt.getMonth() + 1, 2) + "/" + zp(dt.getDate(), 2);
    return ymd;
}

/**
 * 勤怠ページ直行ボタン作成
 * @param {HTMLButtonElement} loginBtn 
 * @param {*} theAmoebaSupportSetting
 * @returns {HTMLButtonElement}
 */
const createDirectWorkScreenBtn = (loginBtn, theAmoebaSupportSetting) => {
    const directWorkScreenBtn = DIRECT_WORK_SCREEN_BUTTON();
    directWorkScreenBtn.onclick = async () => {

        const targetDate = getTargetDate();
        // ログインパラメータから追記
        setParam("referer", "/teams/KTO/PKTO318/editlist.jsp");
        setParam("prepage", "/teams/KTO/PKTO318/editlist.jsp");
        setParam("menuID", 'PKTO318-1');
        setParam("forward", "editlist.jsp");
        setParam("service", "jp.co.kccs.greenearth.erp.kto.pkto318.PKTO318DisplayService");
        setParam("actionbean", "GetList");
        setParam("mode", "search");
        setParam("listsize", -1);
        setParam("ORG_CD_KEY", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_id);
        setParam("ORG_NA_KEY", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_name);
        setParam("ORG_CD_CONDITION", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_id);
        setParam("ORG_NA_CONDITION", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_name);
        setParam("Target_DT_Temp", targetDate);
        setParam("Target_DT_KEY", targetDate);
        setParam("Target_DT_0", targetDate);
        setParam("KTK42_01_Item1", 1);
        setParam("gamenno", 0);
        setParam("AppMode", 1);
        setParam("Origin_MenuID", 'PKTO318-1');
        setParam("Pager_Flag", 1);
        setParam("isForwardManagement", 1);
        setParam("Objective_DT_CON", "");
        setParam("Belong_ORG_CD_1", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_id);
        setParam("ORG_NA", theAmoebaSupportSetting.choice_direct_work_screen_setting.team_name);
        setParam("Stuff_No_CONDITION", "");
        setParam("Stuff_No_2", "");
        loginBtn.click();
    }
    return directWorkScreenBtn;
}

/**
 * 画面読み込み時
 * @returns 
 */
window.onload = async () => {

    if (!isLoginPage()) return;

    // 設定をロード
    const theAmoebaSupportSetting = (await chrome.storage.local.get('the_amoeba_support_setting'))['the_amoeba_support_setting'];
    if (!theAmoebaSupportSetting) return;

    // OFFになっているか
    if (!theAmoebaSupportSetting.choice_direct_work_screen) return;

    // 設定が空だった場合
    if (!theAmoebaSupportSetting.choice_direct_work_screen_setting.team_id || !theAmoebaSupportSetting.choice_direct_work_screen_setting.team_name) return;

    const loginBtn = document.getElementsByTagName("button")[0];
    const directWorkScreenBtn = createDirectWorkScreenBtn(loginBtn, theAmoebaSupportSetting);

    // ログインボタンの下に表示する
    loginBtn.parentElement.appendChild(document.createElement('br'));
    loginBtn.parentElement.appendChild(directWorkScreenBtn);
}