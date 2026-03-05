# -*- coding: utf-8 -*-
import json
from pathlib import Path
from datetime import date,timedelta

p=Path(r"C:/Users/Cromos/.openclaw/workspace/projects/china-trip/trip-data.json")
data=json.loads(p.read_text(encoding='utf-8'))

start=date(2026,4,13); end=date(2026,5,14)
route=[
 (date(2026,4,13),date(2026,4,16),"Hong Kong","Tsim Sha Tsui or Sheung Wan (walkable, MTR access)"),
 (date(2026,4,17),date(2026,4,19),"Shenzhen","Futian District near Civic Center / Coco Park"),
 (date(2026,4,20),date(2026,4,23),"Xi'an","Yongning Gate / Bell Tower area inside city wall"),
 (date(2026,4,24),date(2026,4,26),"Chengdu","Chunxi Road / Taikoo Li or Kuanzhai Alley area"),
 (date(2026,4,27),date(2026,4,29),"Chongqing","Jiefangbei / Yuzhong Peninsula near Line 1/2"),
 (date(2026,4,30),date(2026,5,7),"Yunnan","Split stay: Kunming (2n), Dali Ancient Town (3n), Lijiang Old Town (3n)"),
 (date(2026,5,8),date(2026,5,14),"Hong Kong (Departure Prep)","Tsim Sha Tsui near Airport Express / Kowloon station access")
]

attrs={
 "Hong Kong":("Victoria Peak","https://www.thepeak.com.hk/en","https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=1200&q=80"),
 "Shenzhen":("Ping An Finance Center","https://www.pafcskymall.cn/en/","https://images.unsplash.com/photo-1579273166652-ee4187f3fcb5?auto=format&fit=crop&w=1200&q=80"),
 "Xi'an":("Terracotta Army","http://www.bmy.com.cn/","https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80"),
 "Chengdu":("Chengdu Panda Base","http://www.panda.org.cn/english/","https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80"),
 "Chongqing":("Hongya Cave","https://www.travelchinaguide.com/cityguides/chongqing/hongyadong.htm","https://images.unsplash.com/photo-1602491674275-6a4b0cf2f40a?auto=format&fit=crop&w=1200&q=80"),
 "Yunnan":("Stone Forest (Kunming)","https://www.travelchinaguide.com/attraction/yunnan/kunming/stoneforest/","https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"),
 "Hong Kong (Departure Prep)":("Avenue of Stars","https://www.discoverhongkong.com/eng/explore/great-outdoor/avenue-of-stars.html","https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1200&q=80")
}

travel_plan={
 "2026-04-17":"Bullet train: Hong Kong West Kowloon -> Shenzhen Futian (~15-20 min)",
 "2026-04-20":"Recommended flight: Shenzhen -> Xi'an (faster with child; HSR backup ~9h)",
 "2026-04-24":"Bullet train: Xi'an North -> Chengdu East (~3.5-4.5h)",
 "2026-04-27":"Bullet train: Chengdu East -> Chongqing North (~1.5-2h)",
 "2026-04-30":"Bullet train: Chongqing West -> Kunming South (~5-6h)",
 "2026-05-02":"Bullet train: Kunming -> Dali (~2h)",
 "2026-05-05":"Bullet train: Dali -> Lijiang (~1.5h)",
 "2026-05-08":"Recommended flight: Lijiang (or Kunming) -> Hong Kong",
 "2026-05-14":"UA878 HKG -> SFO 10:30 PM, then UA436 SFO -> YYZ 11:00 PM"
}

budget={"Hong Kong":620,"Shenzhen":500,"Xi'an":560,"Chengdu":560,"Chongqing":540,"Yunnan":590,"Hong Kong (Departure Prep)":620}

def city_for(d):
    for a,b,c,s in route:
        if a<=d<=b: return c,s
    return "TBD","TBD"

it=[]
d=start
while d<=end:
    c,stay=city_for(d)
    aname,aurl,aimg=attrs[c]
    cost=budget[c]
    note=''
    sched=[
      {"time":"07:30","plan":"Breakfast near Airbnb + depart for morning site","type":"meal"},
      {"time":"09:00","plan":f"Explore district highlights in {c}","type":"activity"},
      {"time":"12:30","plan":"Lunch (local restaurant, family break)","type":"meal"},
      {"time":"14:30","plan":f"Major attraction: {aname}","type":"activity"},
      {"time":"18:30","plan":"Dinner + evening walk","type":"meal"},
      {"time":"20:30","plan":"Rest / prep for next day","type":"rest"}
    ]
    ds=d.isoformat()
    if ds in travel_plan:
        note=travel_plan[ds]
        sched.insert(0,{"time":"06:30","plan":"Travel day checkout/transfer buffer","type":"travel"})
        cost += 180
    if d==date(2026,4,13):
        sched=[
          {"time":"04:30","plan":"Leave home for YYZ","type":"travel"},
          {"time":"07:00","plan":"UA565 YYZ -> SFO departs","type":"travel"},
          {"time":"09:39","plan":"Arrive SFO (PST)","type":"travel"},
          {"time":"12:55","plan":"UA869 SFO -> HKG departs","type":"travel"},
          {"time":"18:55 (+1)","plan":"Arrive Hong Kong (HKG)","type":"travel"},
          {"time":"21:00","plan":"Hotel/Airbnb check-in + light meal","type":"meal"}
        ]
        note="Inbound long-haul day."
        cost += 1900
    if d==date(2026,5,14):
        sched=[
          {"time":"08:00","plan":"Breakfast + final packing","type":"meal"},
          {"time":"10:30","plan":"Checkout and airport transfer buffer","type":"travel"},
          {"time":"22:30","plan":"UA878 HKG -> SFO departs","type":"travel"},
          {"time":"20:05 (same day PST)","plan":"Arrive SFO and transfer terminal","type":"travel"},
          {"time":"23:00","plan":"UA436 SFO -> YYZ departs","type":"travel"}
        ]
        note="Return travel day. Toronto arrival: May 15, 07:00 EST."
        cost += 600
    it.append({"date":ds,"weekday":d.strftime('%A'),"city":c,"stayArea":stay,"attraction":{"name":aname,"url":aurl,"img":aimg},"schedule":sched,"estimatedCostCAD":cost,"notes":note})
    d+=timedelta(days=1)

summary={
 "routingLogic":"Mostly bullet train between nearby cities; flights only where rail is inefficient for family pacing.",
 "minimums":{"yunnanDays":sum(1 for x in it if x['city']=="Yunnan"),"xianDays":sum(1 for x in it if x['city']=="Xi'an")}
}

data['itinerary']=it
data['routeSummary']=summary
p.write_text(json.dumps(data,indent=2),encoding='utf-8')
print(summary)
