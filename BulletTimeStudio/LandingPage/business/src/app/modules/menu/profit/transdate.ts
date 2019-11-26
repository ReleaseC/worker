function initDate(date) {
    let initDate = date instanceof Date ? date :new Date();
    var year = initDate.getFullYear();
    var month = initDate.getMonth() + 1;
    var day = initDate.getDate();
    return year + "-" + (month >= 10 ? month : "0" + month) + "-" + (day >= 10 ? day : "0" + day);

}
function initWeek(date) {
    let initDate = date instanceof Date ? date :new Date();
    var year = initDate.getFullYear();

    return year + "-W" + getWeek(initDate);
}
function getWeek(initDate: Date){
    let d1 = initDate.getTime();

    let d2 = new Date(initDate.getFullYear().toString()).getTime();
    let rq = d1-d2;

    let num = Math.ceil(rq/(24*60*60*1000*7));
    return num;
}
function initMonth(date) {
    let initDate = date instanceof Date ? date :new Date();
    
    var year = initDate.getFullYear();
    var month = initDate.getMonth() + 1;
    return year + "-" + (month >= 10 ? month : "0" + month);

}
function date2send(date) {
    return formatSendData(initDate(date), initDate(date));

}
function day2send(date){
    let returnDate = date instanceof Date ? initDate(date) : date;
    console.log(returnDate)
    return formatSendData(returnDate, returnDate);

}
// 从周选择格式2019-W19转换到周日期{start: start, end: end}
function week2send(weekString) {
    let weekList
    console.log(typeof weekString, 'number')
    console.log(typeof weekString ==='number')
    if (typeof weekString === 'number') {
        weekList = [(new Date()).getFullYear(), weekString-1]
        console.log(weekList)
    } else {
        weekList = weekString.replace(/(\d{4})-W(\d{2})/, (_, year, week) => 
        {
        
            // return { year: year, week:week};})
            // 从第一周开始
            return [year, week-1];
        }).split(',');
    }
    console.log(new Date(weekList[0].toString()).getTime())
    console.log(weekList[1] * (24*60*60*1000*7))
    // 获取周时间戳
    let curDate = new Date(weekList[0].toString()).getTime()  + weekList[1] * (24*60*60*1000*7)
    return findWeekSend(new Date(curDate));
}
// 找出当前日期的周一周日
function findWeekSend(date) {
    let initDate = date instanceof Date ? date : new Date();
    let dayInWeek = initDate.getDay();
    dayInWeek == 0 && (dayInWeek = 7);
    let thisWeekFirstDay = initDate.getTime() - (dayInWeek - 1) * 86400000;
    let thisWeekLastDay = initDate.getTime() + (7 - dayInWeek) * 86400000;
    
    return formatSendData(timeToFormat(thisWeekFirstDay), timeToFormat(thisWeekLastDay));
}
function month2send(date) {
    console.log(date)
    
    let dateString = date instanceof Date ?  initDate(date).split('-') : date.split('-')
    let year = dateString[0]
    let month = dateString[1]
    
    // 获取当月天数
    // 获取下个月0号也就是当月最后一天
    let thisMonthLastDay = (new Date(year, Number(month)+1, 0)).getDate();
    var firstDay = `${year}-${month}-01`;
    var lastDay = `${year}-${month}-${thisMonthLastDay}`;
    return formatSendData(firstDay, lastDay);
}
function timeToFormat(time){
    let date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + (month >= 10 ? month : "0" + month) + "-" + (day >= 10 ? day : "0" + day);
}

function formatObj2StrDate({year, month, day}) {
    let newMonth = month >= 10 ? month : "0" + month;
    let newDate = day >= 10 ? day : "0" + day
    return year+'-'+newMonth+'-'+newDate;
}
function anyRange2send(event) {
    let beginDate, endDate
    if(event.length !== 2){
        beginDate= event['beginDate']
        endDate= event['endDate']
    } else {
        beginDate= event[0]
        endDate= event[1]
    }
    console.log(typeof event)
    console.log(event)
    console.log(beginDate)
    let resBeginDate = beginDate instanceof Date ? initDate(beginDate) : formatObj2StrDate(beginDate)
    let resEndDate = endDate instanceof Date ? initDate(endDate) : formatObj2StrDate(endDate)
    return formatSendData(resBeginDate, resEndDate)

}
// 返回格式类型
function formatSendData(firstDay, lastDay) {
    return {
        'beginDate': firstDay,
        'endDate': lastDay
    }
}


function getWeekType(date) {
    let dayInWeek = date.getDay();
    dayInWeek == 0 && (dayInWeek = 7);
    let thisWeekFirstDay = date.getTime() - (dayInWeek - 1) * 86400000;
    let thisWeekLastDay = date.getTime() + (7 - dayInWeek) * 86400000;
    return {
        'beginDate': formateDateFromString(thisWeekFirstDay),
        'endDate': formateDateFromString(thisWeekLastDay)
    }
    // return this.getWeekHtml(firstDay, lastDay);
}

function formateDateFromString(date) {
    date = date instanceof Date ? date : new Date(date);
    let resDate = date.toLocaleDateString();
    return formatDateObj(resDate)
}
function formatDateObj(dateString){
    // 匹配日期 edge格式为 2019年6月12日 chrome为 2019/6/12
    let reg = /(\d{4}).+?(\d{1,2}).+?(\d{1,2})/;
    
    let resDate = dateString.match(reg);
    let month = resDate[2];
    let day = resDate[3];
    return {
        year:Number(resDate[1]),
        month:Number(month),
        day:Number(day)
    }
}
export {
    initDate,
    initMonth,
    initWeek,
    week2send,
    month2send,
    anyRange2send,
    getWeekType,
    day2send
}