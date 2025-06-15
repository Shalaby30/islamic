"use client"

import { useState, useEffect } from "react"
import { MapPin, Book, Heart, Compass, Calendar, Clock, Moon, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PrayerTimes {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface Location {
  city: string
  country: string
  latitude: number
  longitude: number
}

const ahadith = [
  {
    text: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
    narrator: "رواه البخاري ومسلم",
  },
  {
    text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
    narrator: "رواه البخاري ومسلم",
  },
  {
    text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
    narrator: "رواه البخاري ومسلم",
  },
]

const duas = [
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "رب اشرح لي صدري ويسر لي أمري",
  },
  {
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    translation: "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
  },
]

const asmaAlHusna = [
  "الرحمن",
  "الرحيم",
  "الملك",
  "القدوس",
  "السلام",
  "المؤمن",
  "المهيمن",
  "العزيز",
  "الجبار",
  "المتكبر",
  "الخالق",
  "البارئ",
  "المصور",
  "الغفار",
  "القهار",
  "الوهاب",
]

export default function Component() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<Location | null>(null)
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [currentHadith, setCurrentHadith] = useState(0)
  const [currentDua, setCurrentDua] = useState(0)
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Calculate Qibla direction (simplified calculation)
          const qibla = calculateQiblaDirection(lat, lng)
          setQiblaDirection(qibla)

          // Mock location data (in real app, use reverse geocoding)
          setLocation({
            city: "الرياض",
            country: "السعودية",
            latitude: lat,
            longitude: lng,
          })

          // Calculate prayer times (simplified)
          setPrayerTimes({
            Fajr: "05:30",
            Dhuhr: "12:15",
            Asr: "15:45",
            Maghrib: "18:20",
            Isha: "19:50",
          })
        },
        () => {
          // Default to Mecca if location access denied
          setLocation({
            city: "مكة المكرمة",
            country: "السعودية",
            latitude: 21.4225,
            longitude: 39.8262,
          })
          setPrayerTimes({
            Fajr: "05:30",
            Dhuhr: "12:15",
            Asr: "15:45",
            Maghrib: "18:20",
            Isha: "19:50",
          })
        },
      )
    }

    return () => clearInterval(timer)
  }, [])

  const calculateQiblaDirection = (lat: number, lng: number) => {
    // Simplified Qibla calculation (Kaaba coordinates: 21.4225, 39.8262)
    const kaabaLat = (21.4225 * Math.PI) / 180
    const kaabaLng = (39.8262 * Math.PI) / 180
    const userLat = (lat * Math.PI) / 180
    const userLng = (lng * Math.PI) / 180

    const dLng = kaabaLng - userLng
    const y = Math.sin(dLng) * Math.cos(kaabaLat)
    const x = Math.cos(userLat) * Math.sin(kaabaLat) - Math.sin(userLat) * Math.cos(kaabaLat) * Math.cos(dLng)

    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360

    return Math.round(bearing)
  }

  const getNextPrayer = () => {
    if (!prayerTimes) return null

    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    const prayers = [
      { name: "الفجر", time: prayerTimes.Fajr },
      { name: "الظهر", time: prayerTimes.Dhuhr },
      { name: "العصر", time: prayerTimes.Asr },
      { name: "المغرب", time: prayerTimes.Maghrib },
      { name: "العشاء", time: prayerTimes.Isha },
    ]

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      const prayerMinutes = hours * 60 + minutes
      if (prayerMinutes > now) {
        return prayer
      }
    }

    return prayers[0] // Next day Fajr
  }

  const nextPrayer = getNextPrayer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">الموقع الإسلامي</h1>
                <p className="text-emerald-100">دليلك للعبادة والذكر</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{currentTime.toLocaleTimeString("ar-SA")}</div>
              {location && (
                <div className="flex items-center gap-1 text-emerald-100">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {location.city}, {location.country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Prayer Times Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-emerald-800 flex items-center justify-center gap-2">
                <Clock className="w-6 h-6" />
                مواقيت الصلاة
              </CardTitle>
              {nextPrayer && (
                <CardDescription className="text-lg">
                  الصلاة القادمة: <span className="font-semibold text-emerald-700">{nextPrayer.name}</span> في{" "}
                  {nextPrayer.time}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {prayerTimes && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(prayerTimes).map(([prayer, time]) => {
                    const prayerNames: { [key: string]: string } = {
                      Fajr: "الفجر",
                      Dhuhr: "الظهر",
                      Asr: "العصر",
                      Maghrib: "المغرب",
                      Isha: "العشاء",
                    }
                    return (
                      <div key={prayer} className="text-center p-4 bg-emerald-50 rounded-lg">
                        <div className="font-semibold text-emerald-800">{prayerNames[prayer]}</div>
                        <div className="text-xl font-bold text-emerald-600">{time}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quran" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="quran" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              القرآن
            </TabsTrigger>
            <TabsTrigger value="hadith" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              الأحاديث
            </TabsTrigger>
            <TabsTrigger value="duas" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              الأدعية
            </TabsTrigger>
            <TabsTrigger value="qibla" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              القبلة
            </TabsTrigger>
            <TabsTrigger value="names" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              الأسماء الحسنى
            </TabsTrigger>
          </TabsList>

          {/* Quran Tab */}
          <TabsContent value="quran">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">القرآن الكريم</CardTitle>
                <CardDescription>اقرأ القرآن الكريم بخط واضح وجميل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-800 mb-4">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                  <div className="text-2xl leading-relaxed text-emerald-700 mb-4">
                    الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿١﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٢﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٣﴾
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    سورة الفاتحة
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة"].map(
                    (surah) => (
                      <Button
                        key={surah}
                        variant="outline"
                        className="h-12 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        {surah}
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hadith Tab */}
          <TabsContent value="hadith">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">الأحاديث النبوية</CardTitle>
                <CardDescription>من أقوال النبي محمد صلى الله عليه وسلم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="text-xl leading-relaxed text-amber-800 mb-4">"{ahadith[currentHadith].text}"</div>
                    <div className="text-sm text-amber-600">{ahadith[currentHadith].narrator}</div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setCurrentHadith((prev) => (prev - 1 + ahadith.length) % ahadith.length)}
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      السابق
                    </Button>
                    <Button
                      onClick={() => setCurrentHadith((prev) => (prev + 1) % ahadith.length)}
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Duas Tab */}
          <TabsContent value="duas">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">الأدعية المأثورة</CardTitle>
                <CardDescription>أدعية من القرآن والسنة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl leading-relaxed text-blue-800 mb-4">{duas[currentDua].arabic}</div>
                    <Separator className="my-4" />
                    <div className="text-lg text-blue-600">{duas[currentDua].translation}</div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setCurrentDua((prev) => (prev - 1 + duas.length) % duas.length)}
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      السابق
                    </Button>
                    <Button
                      onClick={() => setCurrentDua((prev) => (prev + 1) % duas.length)}
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Qibla Tab */}
          <TabsContent value="qibla">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">اتجاه القبلة</CardTitle>
                <CardDescription>اتجه نحو الكعبة المشرفة للصلاة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center relative">
                    <Compass
                      className="w-24 h-24 text-emerald-600"
                      style={{
                        transform: qiblaDirection ? `rotate(${qiblaDirection}deg)` : "none",
                      }}
                    />
                    <div className="absolute top-4 text-sm font-semibold text-emerald-800">شمال</div>
                    <div className="absolute bottom-4 text-sm font-semibold text-emerald-800">جنوب</div>
                    <div className="absolute left-4 text-sm font-semibold text-emerald-800">غرب</div>
                    <div className="absolute right-4 text-sm font-semibold text-emerald-800">شرق</div>
                  </div>
                  {qiblaDirection && (
                    <div className="text-lg">
                      <span className="text-emerald-800">اتجاه القبلة: </span>
                      <span className="font-bold text-emerald-600">{qiblaDirection}°</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">استخدم البوصلة أعلاه لتحديد اتجاه القبلة من موقعك الحالي</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Names Tab */}
          <TabsContent value="names">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">أسماء الله الحسنى</CardTitle>
                <CardDescription>الأسماء التسعة والتسعون لله عز وجل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {asmaAlHusna.map((name, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-lg font-bold text-purple-800">{name}</div>
                      <div className="text-sm text-purple-600">{index + 1}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Islamic Calendar */}
        <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              التقويم الهجري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                {new Date().toLocaleDateString("ar-SA-u-ca-islamic")}
              </div>
              <div className="text-emerald-600">الموافق {new Date().toLocaleDateString("ar-SA")} ميلادي</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6" />
            <span className="text-xl font-bold">الموقع الإسلامي</span>
          </div>
          <p className="text-emerald-200">"وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ"</p>
          <p className="text-sm text-emerald-300 mt-2">جميع الحقوق محفوظة © 2024</p>
        </div>
      </footer>
    </div>
  )
}
