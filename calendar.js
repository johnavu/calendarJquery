var calendar = {
	init:function(settings){
		calendar.config = {
			dayInWeek : ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"],
			monInYear : ['January','February','March','April','May','June','July','August','September','October','November','December'],
			positon : '#calendar',

			formatHtml:'<div><div id="headerCalendar"><div id="blockYear"><div id="py"></div><div id="year"></div><div id="ny"></div></div><div><div id="pm"></div><div id="month"></div><div id="nm"></div></div></div><div id="calendarForm"></div><div id="showday"></div></div>'
		};
		$.extend( calendar.config, settings );
		date = new Date();
		
		
		if(typeof calendar.config.month === 'undefined'){
			month_crr = date.getMonth();
			
		}else{

			month_crr = calendar.config.month-1;
		}
		if(typeof calendar.config.year === 'undefined'){
			year_crr = date.getFullYear();
			
		}else{
			year_crr = calendar.config.year;
		}
		
		$(calendar.config.positon).html(calendar.config.formatHtml);
		
		calendar.createCalendar(month_crr,year_crr);

		calendar.clickEvent(month_crr,year_crr);
		
		
		
	},
	clickEvent:function(month,year){
		// console.log(year);
		$(calendar.config.positon).find('#ny').on('click',function(){
			year = year+1;
			calendar.createCalendar(month,year);
		});
		$(calendar.config.positon).find('#py').on('click',function(){
			year = year-1;
			calendar.createCalendar(month,year);
		});
		$(calendar.config.positon).find('#nm').on('click',function(){
			month = month+1;
			if(month>=12){
				month = 0;
				year=year+1;
			}
			calendar.createCalendar(month,year);
		});
		$(calendar.config.positon).find('#pm').on('click',function(){
			month = month-1;
			if(month<0){
				month = 11;
				year=year-1;
			}
			calendar.createCalendar(month,year);
		});

	},
	clickDay:function(reminder){

		$(calendar.config.positon).find('.bodyCalendar div').click(function(){
			day = $(this).find('span').html();
			month = $(this).data('month');
			year=$(this).data('year');
			
			date = calendar.dateInWeek(month,year,day);
			
			str = '<div id="datetime">'+calendar.config.dayInWeek[date]+', '+day+' '+calendar.config.monInYear[month]+' '+year+'</div>';
			if(typeof reminder !== 'undefined'){
				$.each(reminder,function(k,v){
					dayR = calendar.getDateTime('day',v.begin);
					
					if(day == dayR){
						str += "<div class='block'>"
						$.each(v,function(key,val){
							str +='<div><span>'+key+': </span><span>'+val+'</span></div>';
						});
						str+='</div>';
					}
					
					
				});
			}
			$(calendar.config.positon).find('#showday').html(str);
			
			$(calendar.config.positon).find('.bodyCalendar div').each(function(){
				if($(this).hasClass('active')){
					$(this).removeClass('active');
				}
			});
			$(this).addClass('active');	

			if(!$(this).hasClass('inMonth')){
				calendar.createCalendar(month,year,day);
			}
			
			
		});

},
createCalendar:function(month,year,day){

	daysInMonth = calendar.daysInMonth(month+1,year);
	startDay = calendar.dateInWeek(month,year,1);
	daysInPrevMonth = calendar.daysInMonth(month,year);
	numberWeekInMonth = Math.ceil((daysInMonth + startDay)/7);
	var titleCalendar = '<div id="titleCalendar">';
	for(i=0;i<=6;i++){
		titleCalendar = titleCalendar + "<div>"+calendar.config.dayInWeek[i]+'</div>';
	}
	titleCalendar += '</div>'
	beginMonth = (daysInPrevMonth + 1 - startDay);
	numberDayInMonth = numberWeekInMonth * 7 ;
	var dayM = [];
	var a,b;
	date = new Date();
	dayCrr = date.getDate();
	monthCrr = date.getMonth();
	yearCrr=date.getFullYear()
	for(i=beginMonth;i<(beginMonth+numberDayInMonth);i++){

		if(beginMonth!=1){
			d = (beginMonth+startDay+daysInMonth);
			if(i>daysInPrevMonth && i < d ){
				a= i - daysInPrevMonth;
				if(a==dayCrr && month==monthCrr && year == yearCrr){
					a= '<div class="inMonth" data-year="'+year+'" data-month="'+month+'" id="today"><span>'+a+'</span></div>';
				}else if(a==day){

					a= '<div class="inMonth active" data-year="'+year+'" data-month="'+month+'"><span>'+a+'</span></div>';
				}else{
					a= '<div class="inMonth" data-year="'+year+'" data-month="'+month+'"><span>'+a+'</span></div>';
				}



			}else if(i>=d && i<=(beginMonth+numberDayInMonth)){
				a=i -daysInPrevMonth - daysInMonth;
				if(month==11){
					nextMonth = 0;
					nextYear = year+1;
				}else{
					nextMonth = month+1;
					nextYear=year;
				}
				a= '<div data-month="'+nextMonth+'" data-year="'+nextYear+'"><span>'+a+'</span></div>';
			}else{
				a = i;
				if(month==0){
					prevMonth = 11;
					prevYear = year-1;
				}else{
					prevMonth = month-1;
					prevYear=year;
				}
				a= '<div data-year="'+prevYear+'" data-month="'+prevMonth+'"><span>'+a+'</span></div>';
			}
		}else{
			if(i>daysInMonth){
				a = i - daysInMonth;
				if(month==11){
					nextMonth = 0;
					nextYear = year+1;
				}else{
					nextMonth = month+1;
					nextYear=year;
				}
				a= '<div data-month="'+nextMonth+'" data-year="'+nextYear+'"><span>'+a+'</span></div>';
			}else{
				a = i;
				if(a==today){
					a= '<div class="inMonth" data-month="'+month+'" data-year="'+year+'" id="today"><span>'+a+'</span></div>';
				}else if(a===day){

					a= '<div class="inMonth active" data-month="'+month+'" data-year="'+year+'"><span>'+a+'</span></div>';
				}else{
					a= '<div class="inMonth" data-month="'+month+'" data-year="'+year+'"><span>'+a+'</span></div>';
				}

			}
		}

		dayM.push(a);
	}

	bodyCalendar = '';
	$.each(dayM, function(k,v){
		if(k%7 == 0){
			bodyCalendar += '<div class="bodyCalendar">'+v;
		}else if(k%7==6){
			bodyCalendar += v+'</div>'
		}else{
			bodyCalendar += v;
		}
	});

	calendarForm = titleCalendar + bodyCalendar;
	$(calendar.config.positon).find('#showday').html('');
	$(calendar.config.positon).find('#month').html(calendar.config.monInYear[month]);
	$(calendar.config.positon).find('#year').html(year);
	$(calendar.config.positon).find('#calendarForm').html(calendarForm);
	calendar.clickDay();
	calendar.ajax(month,year);



},
ajax:function(month,year){
	$.ajax({
		type: "GET",
		url: "reminder.json",
		dataType: "JSON",
		async: false,
		cache:false,
		beforeSend: function(x) {
			if(x && x.overrideMimeType) {
				x.overrideMimeType("application/j-son;charset=UTF-8");
			}
		},
		success: function (r) {
			var reminderInMonth = [];
			$.each(r,function(k,v){
				var begin = v.begin;

				dayReminder = calendar.getDateTime('day',begin);
				yearReminder = calendar.getDateTime('year',begin);
				monthReminder = calendar.getDateTime('month',begin);
				if((month+1) == monthReminder && year == yearReminder){

					$(calendar.config.positon).find('.inMonth').each(function(){
						if($(this).find('span').html()== dayReminder){
							$(this).addClass('hasReminder');
							reminderInMonth.push(v);
						}
					})
				}
			});
			calendar.clickDay(reminderInMonth);
		},
		error:function(){
			alert('Khong Doc duoc file Json');
		}
	});
},
daysInMonth:function(month,year){
	return new Date(year, month, 0).getDate();
},
dateInWeek:function(month,year,day){
	var d = new Date(year, month, day);
	return d.getDay();
},
getDateTime:function(title,stringDateTime){
	datetime = stringDateTime.split(' ');
	getDay = datetime[0].split('/');
	getTime = datetime[1].split(':');
	if(title == 'day')
		return getDay[2];
	if(title == 'month')
		return getDay[1];
	if(title =='year')
		return getDay[0];
	if(title=='hour')
		return getTime[0];
	if(title=='min')
		return getTime[1];
	if(title =='sec')
		return getTime[2];

}
}