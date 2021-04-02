module.exports = {
  //image_src: "http://192.168.7.192:3000/images/",
  image_src: "http://localhost:3000/images/",
  parking_name: "하계테크노타운",
 // web_server_address: "http://192.168.7.192:3000",
  web_server_address: "http://localhost:3000",
  location: {
    in: "입구1",
    out: "출구1"
  },
  verInfo: "요금정산소 Ver 0.1",
  payment_name: "출구1",  
  machinemodel: "M201S",
  machineid: "01",
  payment_terminal_list:[
	{
		ip: "192.168.7.44",
		//ip: "localhost",
		port: 9104,
		siteid: "A0002",
		machinemodel: "EZP150E", // 출구무인정산기 : EZP150E, 사전무인정산기 : EZP150P
		machineid: "01", 
		location: "출구1",
		description: "출구1 출구정산기",
		direction: "out"
	}
],
pre_payment_terminal_list:[
	/*{
		ip: "192.168.7.64",
		//"ip" : "localhost",
		port: 9105,
		siteid: "A0002",
		machinemodel: "EZP150P",  	// 출구무인정산기 : EZP150E, 사전무인정산기 : EZP150P
		location: "현관정문",
		description: "현관정문_사전정산기",
		machineid: "01"
	} */
],
  discounted_coupon_policy: {
		coupon_site_id: "0790",
		coupon_kind: [			
			{ 
				value: "01",		//10분 할인
				name: "10분쿠폰",
				keymap: "R1",
				real_value: 10,
				contents: "10분 할인"
			},
			{ 
				value: "02",		//20분 할인
				name: "20분쿠폰",
				keymap: "R2",
				real_value: 20,
				contents: "20분 할인"
			},
			{ 
				value: "03",		//30분 할인
				name: "30분쿠폰",
				keymap: "R3",
				real_value: 30,
				contents: "30분 할인"
			},
			{ 
				value: "04",		//60분 할인
				keymap: "R4",
				name: "60분쿠폰",
				real_value: 60,
				contents: "60분 할인"
			},
			{ 
				value: "05",		//120분 할인
				keymap: "R5",
				name: "120분쿠폰",
				real_value: 120,
				contents: "120분 할인"
			},
			{ 
				value: "06",		//180분 할인
				keymap: "R6",
				name: "180분쿠폰",
				real_value: 180,
				contents: "180분 할인"
			},
			{ 
				value: "10",		//1일 할인
				keymap: "R7",
				name: "1일쿠폰",
				real_value: 1440,
				contents: "1일 할인"				
			},
			{ 
				value: "99",		//무료
				keymap: "R8",
				name: "무료쿠폰",
				real_value: 10000000,
				contents: "무료"				
			}				
		]		
	},
	discounted_reductuion_policy_list:[ // title: "장애인", time: "1시간", price: "5000원", bt: "R01", value: "R01"
		{
			title: "장애인",
			hour: "0",
			value1: "80",
			keymap: "F01",
			unit: "percent",
			str_value: "80%",
			value: "장애인",
			contents: "장애인"
		},
		{
			title: "유공자",
			hour: "0",
			value1: "80",
			keymap: "F02",
			unit: "percent",
			str_value: "80%",
			value: "유공자",
			contents: "국가유공상이자"
		},
		{
			title: "고엽제",
			hour: "0",
			value1: "80",
			keymap: "F03",
			unit: "percent",
			str_value: "80%",
			value: "고엽제",
			contents: "고엽제후유(의)증 환자"
		},
		{
			title: "의상자",
			hour: "0",
			value1: "80",
			keymap: "F04",
			unit: "percent",
			str_value: "80%",
			value: "의상자",
			contents: "의상자"
		},
		{
			title: "독립유공자",
			hour: "0",
			value1: "80",
			keymap: "F05",
			unit: "percent",
			str_value: "80%",
			value: "독립유공자",
			contents: "독립유공자"
		},
		{
			title: "518",
			hour: "1",
			value1: "50",
			keymap: "F06",
			unit: "percent",
			str_value: "1시간 할인후 50%",
			value: "518",
			contents: "518민주유공부상자"
		},
		{
			title: "전기차",
			hour: "1",
			value1: "50",
			keymap: "F07",
			unit: "percent",
			str_value: "1시간 할인후 50%",
			value: "전기차",
			contents: "전기 자동차 충전"
		},
		{
			title: "경차",
			hour: "0",
			value1: "50",
			keymap: "F08",
			unit: "percent",
			str_value: "50%",
			value: "경차",
			contents: "경형 자동차"
		},
		{
			title: "저공해",
			hour: "0",
			value1: "50",
			keymap: "F09",
			unit: "percentt",
			str_value: "50%",
			value: "저공해",
			contents: "저공해자동차"
		},
		{
			title: "다둥이1",
			hour: "0",
			value1: "50",
			keymap: "F10",
			unit: "percent",
			str_value: "50%",
			value: "다둥이1",
			contents: "다둥이 행복카드(3자녀)"
		},
		{
			title: "부상군경",
			hour: "0",
			value1: "50",
			keymap: "F11",
			unit: "percent",
			str_value: "50%",			
			value: "부상군경",
			contents: "재해부상군경, 재해부상공무원"
		},
		{
			title: "다둥이2",
			hour: "0",
			value1: "30",
			keymap: "F12",
			unit: "percent",
			str_value: "30%",
			value: "다둥이2",
			contents: "다둥이 행복카드(2자녀)"
		},
		{
			title: "모범납세자",
			hour: "0",
			value1: "100",
			keymap: "F13",
			unit: "percent",
			str_value: "100%",
			value: "모범납세자",
			contents: "성실납세증 부착차량"
		},
		{
			title: "투표",
			hour: "0",
			value1: "2000",
			keymap: "F14",
			unit: "won",
			str_value: "2,000원",
			value: "투표",
			contents: "투표참여자"
		},
		{
			title: "시책업무",
			hour: "0",
			value1: "30",
			keymap: "F15",
			unit: "minutes",
			str_value: "30분",
			value: "시책업무",
			contents: "시책업무 추진"
		}
	]
}
