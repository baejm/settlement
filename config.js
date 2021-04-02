module.exports = {
  //image_src: "http://ht1.iptime.org:3000/images/",
  image_src: "http://localhost:3000/images/",
  parking_name: "하계테크노타운 주차장",
  //web_server_address: "http://ht1.iptime.org:3000",
  web_server_address: "http://localhost:3000",  
  location:{
    in: "입구1",
    out: "출구1"    
  },
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
	discounted_reductuion_policy:[
		{
			name: "장애인",
			hour: "0",
			value: "80",
			keymap: "F01",
			unit: "percnet",
			contents: "장애인"
		},
		{
			name: "유공자",
			hour: "0",
			value: "80",
			keymap: "F02",
			unit: "percnet",
			contents: "국가유공상이자"
		},
		{
			name: "고엽제",
			hour: "0",
			value: "80",
			keymap: "F03",
			unit: "percnet",
			contents: "고엽제후유(의)증 환자"
		},
		{
			name: "의상자",
			hour: "0",
			value: "80",
			keymap: "F04",
			unit: "percnet",
			contents: "의상자"
		},
		{
			name: "독립유공자",
			hour: "0",
			value: "80",
			keymap: "F05",
			unit: "percnet",
			contents: "독립유공자"
		},
		{
			name: "518",
			hour: "1",
			value: "50",
			keymap: "F06",
			unit: "percnet",
			contents: "518민주유공부상자"
		},
		{
			name: "전기차",
			hour: "1",
			value: "50",
			keymap: "F07",
			unit: "percnet",
			contents: "전기 자동차 충전"
		},
		{
			name: "경차",
			hour: "0",
			value: "50",
			keymap: "F08",
			unit: "percnet",
			contents: "경형 자동차"
		},
		{
			name: "저공해",
			hour: "0",
			value: "50",
			keymap: "F09",
			unit: "percnet",
			contents: "저공해자동차"
		},
		{
			name: "다둥이1",
			hour: "0",
			value: "50",
			keymap: "F10",
			unit: "percnet",
			contents: "다둥이 행복카드(3자녀)"
		},
		{
			name: "부상군경",
			hour: "0",
			value: "50",
			keymap: "F11",
			unit: "percnet",
			contents: "재해부상군경, 재해부상공무원"
		},
		{
			name: "다둥이2",
			hour: "0",
			value: "30",
			keymap: "F12",
			unit: "percnet",
			contents: "다둥이 행복카드(2자녀)"
		},
		{
			name: "모범납세자",
			hour: "0",
			value: "100",
			keymap: "F13",
			unit: "percnet",
			contents: "성실납세증 부착차량"
		},
		{
			name: "투표",
			hour: "0",
			value: "2000",
			keymap: "F14",
			unit: "won",
			contents: "투표참여자"
		},
		{
			name: "시책업무",
			hour: "0",
			value: "30",
			keymap: "F15",
			unit: "minutes",
			contents: "시책업무 추진"
		}
	]
}