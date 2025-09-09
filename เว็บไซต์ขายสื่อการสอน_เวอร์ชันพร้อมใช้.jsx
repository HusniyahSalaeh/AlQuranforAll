import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  BookOpen,
  GraduationCap,
  FileText,
  Search,
  Filter,
  SortAsc,
  X,
  Plus,
  Minus,
  Menu,
  Sparkles,
  BadgeCheck,
  Globe,
  CreditCard,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

/**
 * เว็บไซต์พร้อมใช้สำหรับขาย "ใบงาน / คอร์สออนไลน์ / หนังสือการ์ตูน"
 *
 * วิธีแก้ไขอย่างรวดเร็ว (เหมาะกับผู้ไม่ถนัดโค้ด):
 * 1) แก้ไขค่าในตัวแปร `CATALOG` ด้านล่างเพื่อเพิ่มสินค้า/คอร์ส/หนังสือ
 * 2) แก้ไข `SITE` เพื่อตั้งชื่อแบรนด์ โทนสี และลิงก์โซเชียล
 * 3) ปุ่มชำระเงินตอนนี้เป็นตัวอย่าง — ต่อเข้ากับลิงก์ชำระเงินของคุณ (เช่น LINE, PromptPay, Stripe, Omise) ได้ทันที
 * 4) นำไฟล์นี้ไปใช้บน Next.js/React ใด ๆ ที่รองรับ shadcn/ui + Tailwind ได้เลย
 */

// ====== "CMS" แบบง่าย ปรับแก้ในที่เดียว ======
const SITE = {
  brand: "EduCartoon",
  tagline: "แหล่งรวมใบงาน คอร์สออนไลน์ และหนังสือการ์ตูนเพื่อการเรียนรู้สนุก ๆ",
  highlight: "เปิดตัว! คอลเลกชันใบงานวิทยาศาสตร์ ป.4-6",
  theme: {
    // คุณสามารถปรับสีได้ด้วยคลาส Tailwind ที่หุ้มไว้ด้านล่าง
    accent: "bg-indigo-600 hover:bg-indigo-700",
  },
  social: {
    facebook: "https://facebook.com/",
    line: "https://line.me/ti/p/",
    tiktok: "https://tiktok.com/@",
    youtube: "https://youtube.com/@",
  },
  payment: {
    promptpayQR: "", // ใส่ลิงก์รูปภาพ QR ได้
    howTo: "โอนผ่าน PromptPay แล้วแนบสลิปในกล่องข้อความ หรือส่งมาที่ LINE",
    checkoutLink: "#", // ลิงก์ไปหน้าชำระเงิน/ฟอร์มเก็บที่อยู่จริง
  },
};

// หมวดหมู่: worksheet | course | comic
const CATALOG = [
  {
    id: "wks-001",
    type: "worksheet",
    title: "ใบงานคณิต ป.3 ชุดที่ 1",
    price: 79,
    tags: ["คณิต", "ป.3"],
    desc: "แบบฝึกหัดบวก ลบ คูณ หาร พร้อมเฉลย ดาวน์โหลดเป็น PDF พิมพ์ได้",
    thumb: "https://images.unsplash.com/photo-1584697964154-3f71e66b4a7a?w=600&auto=format&fit=crop&q=60",
    downloadSample: "#",
    digital: true,
    bestseller: true,
  },
  {
    id: "wks-002",
    type: "worksheet",
    title: "ใบงานวิทย์ ป.5 เรื่อง สิ่งมีชีวิต",
    price: 89,
    tags: ["วิทยาศาสตร์", "ป.5"],
    desc: "กิจกรรมสืบเสาะหาความรู้ แผ่นกิจกรรม + ใบประเมิน",
    thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=60",
    downloadSample: "#",
    digital: true,
    new: true,
  },
  {
    id: "crs-101",
    type: "course",
    title: "วาดการ์ตูนตั้งแต่ 0 ถึงออกเล่มแรก",
    price: 1290,
    tags: ["การ์ตูน", "วาดภาพ", "ผู้เริ่มต้น"],
    desc: "คอร์สวิดีโอ 20 บท + ไฟล์ brush + กลุ่มเฉพาะตอบคำถาม",
    thumb: "https://images.unsplash.com/photo-1544551763-7ef42006926f?w=600&auto=format&fit=crop&q=60",
    hours: 12,
    lessons: 45,
    digital: true,
    bestseller: true,
  },
  {
    id: "crs-102",
    type: "course",
    title: "ฟิสิกส์สนุก ม.ต้น: แรงและการเคลื่อนที่",
    price: 1590,
    tags: ["ฟิสิกส์", "มัธยมต้น"],
    desc: "คอร์สอินเตอร์แอคทีฟ + แบบฝึกหัดออนไลน์ + ใบงานแถม",
    thumb: "https://images.unsplash.com/photo-1517976487492-576ea3455634?w=600&auto=format&fit=crop&q=60",
    hours: 10,
    lessons: 30,
    digital: true,
  },
  {
    id: "cmc-201",
    type: "comic",
    title: "นักสืบหมีพูห์ ภาค 1",
    price: 199,
    tags: ["การ์ตูน", "สืบสวน"],
    desc: "หนังสือการ์ตูนพิมพ์สีทั้งเล่ม พร้อมโค้ดโหลด e-book",
    thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=60",
    digital: true,
    physical: true,
  },
  {
    id: "cmc-202",
    type: "comic",
    title: "วิทย์มันส์ซ่า เล่มพิเศษ: ห้องทดลองในครัว",
    price: 179,
    tags: ["วิทยาศาสตร์", "ครอบครัว"],
    desc: "คอมิกความรู้ ทดลองง่าย ๆ ในบ้าน เหมาะกับทุกวัย",
    thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=60",
    digital: true,
    physical: false,
    new: true,
  },
];

// ====== ยูทิล ======
const currency = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB" });

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// ====== คอมโพเนนต์หลัก ======
export default function Storefront() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"worksheet" | "course" | "comic" | "all">("all");
  const [sort, setSort] = useState<"popular" | "new" | "price_asc" | "price_desc">("popular");
  const [onlyDigital, setOnlyDigital] = useState(false);
  const [cart, setCart] = useLocalStorage<{ id: string; qty: number }[]>("cart", []);
  const [active, setActive] = useState<any | null>(null); // รายการที่เปิดดูรายละเอียด

  const filtered = useMemo(() => {
    let items = CATALOG.slice();
    if (type !== "all") items = items.filter((i) => i.type === type);
    if (onlyDigital) items = items.filter((i) => i.digital);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) => i.title.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)) || i.desc.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "new":
        items = items.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "price_asc":
        items = items.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        items = items.sort((a, b) => b.price - a.price);
        break;
      default:
        items = items.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
    return items;
  }, [query, type, sort, onlyDigital]);

  const total = useMemo(
    () =>
      cart.reduce((sum, c) => {
        const item = CATALOG.find((i) => i.id === c.id);
        return sum + (item ? item.price * c.qty : 0);
      }, 0),
    [cart]
  );

  const addToCart = (id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { id, qty }];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id: string, qty: number) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/75 border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
          <Menu className="h-6 w-6 md:hidden" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 grid place-items-center text-white shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold leading-tight">{SITE.brand}</div>
              <div className="text-xs text-slate-500">{SITE.tagline}</div>
            </div>
            <Badge className="ml-2 bg-emerald-600">พร้อมขาย</Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href={SITE.social.facebook} className="text-sm text-slate-600 hover:underline hidden md:inline">
              Facebook
            </a>
            <a href={SITE.social.line} className="text-sm text-slate-600 hover:underline hidden md:inline">
              LINE
            </a>
            <a href={SITE.social.youtube} className="text-sm text-slate-600 hover:underline hidden md:inline">
              YouTube
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <ShoppingCart className="h-4 w-4" /> ตะกร้า ({cart.reduce((a, b) => a + b.qty, 0)})
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>ตะกร้าสินค้า</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {cart.length === 0 && <div className="text-sm text-slate-500">ยังไม่มีสินค้า</div>}
                  {cart.map((c) => {
                    const item = CATALOG.find((i) => i.id === c.id)!;
                    return (
                      <div key={c.id} className="flex items-center gap-3 border rounded-xl p-3">
                        <img src={item.thumb} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-slate-500">{currency(item.price)}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="icon" variant="outline" onClick={() => setQty(c.id, c.qty - 1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="w-9 text-center">{c.qty}</div>
                            <Button size="icon" onClick={() => setQty(c.id, c.qty + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" onClick={() => removeFromCart(c.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>รวม</span>
                    <span className="font-semibold">{currency(total)}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">{SITE.payment.howTo}</div>
                  <div className="flex gap-2 mt-4">
                    <Button className={`${SITE.theme.accent} w-full gap-2`}>
                      <CreditCard className="h-4 w-4" /> ชำระเงิน/กรอกข้อมูล
                    </Button>
                    <Button variant="outline" onClick={clearCart}>
                      ล้างตะกร้า
                    </Button>
                  </div>
                </div>
                <SheetFooter className="mt-4">
                  <div className="text-xs text-slate-400">
                    * ระบบเป็นเดโม่ ต่อเกตเวย์ชำระเงินจริงได้ (Stripe/Omise/PromptPay)
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              สร้างการเรียนรู้ให้สนุก ด้วยสื่อพร้อมใช้
            </h1>
            <p className="text-slate-600 mt-3 md:text-lg">{SITE.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="gap-1"><FileText className="h-3.5 w-3.5" /> ใบงาน</Badge>
              <Badge variant="secondary" className="gap-1"><GraduationCap className="h-3.5 w-3.5" /> คอร์สออนไลน์</Badge>
              <Badge variant="secondary" className="gap-1"><BookOpen className="h-3.5 w-3.5" /> หนังสือการ์ตูน</Badge>
              <Badge className="gap-1 bg-amber-500"><BadgeCheck className="h-3.5 w-3.5" /> คุณครูใช้ได้ ผู้ปกครองก็เลิฟ</Badge>
            </div>
            <div className="mt-6 flex gap-2">
              <a href="#catalog">
                <Button className={`${SITE.theme.accent} gap-2`}>
                  ช็อปเลย <ShoppingCart className="h-4 w-4" />
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" className="gap-2">
                  พูดคุยกับเรา <Globe className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="mt-3 text-sm text-indigo-700 font-medium">{SITE.highlight}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&auto=format&fit=crop&q=60"
                className="rounded-3xl shadow-2xl border"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow p-3 flex items-center gap-2 border">
                <Info className="h-4 w-4" /> แก้รูป/ข้อความได้จากตัวแปรด้านบน
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section id="catalog" className="border-t bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="ค้นหาชื่อสินค้า แท็ก หรือคำอธิบาย"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="worksheet">ใบงาน</SelectItem>
                  <SelectItem value="course">คอร์ส</SelectItem>
                  <SelectItem value="comic">การ์ตูน</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v: any) => setSort(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">ยอดนิยม</SelectItem>
                  <SelectItem value="new">มาใหม่</SelectItem>
                  <SelectItem value="price_asc">ราคาต่ำ-สูง</SelectItem>
                  <SelectItem value="price_desc">ราคาสูง-ต่ำ</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm">เฉพาะดิจิทัล</span>
                <Switch checked={onlyDigital} onCheckedChange={setOnlyDigital} />
              </div>
            </div>
          </div>

          {/* Tabs guide */}
          <Tabs defaultValue="all" className="mt-4" onValueChange={(v: any) => setType(v)}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="worksheet"><FileText className="h-3.5 w-3.5 mr-1" /> ใบงาน</TabsTrigger>
              <TabsTrigger value="course"><GraduationCap className="h-3.5 w-3.5 mr-1" /> คอร์ส</TabsTrigger>
              <TabsTrigger value="comic"><BookOpen className="h-3.5 w-3.5 mr-1" /> การ์ตูน</TabsTrigger>
            </TabsList>
            <TabsContent value="all" />
            <TabsContent value="worksheet" />
            <TabsContent value="course" />
            <TabsContent value="comic" />
          </Tabs>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-2xl">
                <div className="relative">
                  <img src={item.thumb} className="h-44 w-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.bestseller && <Badge className="bg-rose-600">ขายดี</Badge>}
                    {item.new && <Badge className="bg-emerald-600">มาใหม่</Badge>}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{currency(item.price)}</div>
                    <div className="text-xs text-slate-500">{item.digital ? "Digital" : ""}{item.physical ? " + หนังสือจริง" : ""}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className={`${SITE.theme.accent} w-full gap-2`} onClick={() => addToCart(item.id)}>
                    <ShoppingCart className="h-4 w-4" /> เพิ่มลงตะกร้า
                  </Button>
                  <Button variant="outline" onClick={() => setActive(item)}>ดูรายละเอียด</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA แทรกดาวน์โหลดตัวอย่าง/แคตตาล็อก */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="rounded-3xl border-indigo-200">
            <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="text-2xl font-bold">ดาวน์โหลดแคตตาล็อกตัวอย่าง</div>
                <p className="text-slate-600 mt-2">รวมตัวอย่างใบงาน คอร์ส และตัวอย่างหน้าหนังสือการ์ตูน</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> ดาวน์โหลด PDF
                  </Button>
                  <a href="#catalog"><Button className={`${SITE.theme.accent}`}>เลือกต่อ</Button></a>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&auto=format&fit=crop&q=60"
                className="rounded-2xl border shadow"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ & Contact */}
      <section id="contact" className="py-12 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold">คำถามที่พบบ่อย</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold">Q: ได้ไฟล์เมื่อไหร่?</span>
                <br />A: สินค้าดิจิทัลจะได้รับลิงก์ดาวน์โหลดทันทีหลังชำระเงิน
              </li>
              <li>
                <span className="font-semibold">Q: นำไปใช้เชิงพาณิชย์ได้ไหม?</span>
                <br />A: ใช้สอนในห้องเรียน/ครอบครัวได้ หากต้องการลิขสิทธิ์เพิ่มเติมติดต่อเรา
              </li>
              <li>
                <span className="font-semibold">Q: ออกใบเสร็จได้หรือไม่?</span>
                <br />A: ได้ แจ้งรายละเอียดในฟอร์มสั่งซื้อได้เลย
              </li>
            </ul>
          </div>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>ติดต่อ/สั่งซื้อแบบด่วน</CardTitle>
              <CardDescription>ระบุรายการที่ต้องการหรือสอบถามข้อมูล</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="ชื่อของคุณ" />
              <Input placeholder="อีเมลหรือ LINE ID" />
              <Textarea placeholder="ข้อความ" />
              <div className="flex gap-2">
                <Button className={`${SITE.theme.accent}`}>ส่งข้อความ</Button>
                <a href={SITE.social.line}><Button variant="outline">แชทผ่าน LINE</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ฟุตเตอร์ */}
      <footer className="py-6 border-t text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {SITE.brand} • ทั้งหมดนี้ปรับแก้ได้ • ทำด้วยรักให้การเรียนรู้สนุกขึ้น
      </footer>

      {/* Modal รายละเอียดสินค้า */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="leading-tight">{active.title}</DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4">
                <img src={active.thumb} className="rounded-xl border object-cover w-full h-44" />
                <div>
                  <div className="text-sm text-slate-600">{active.desc}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {active.tags.map((t: string) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                  <div className="mt-3 text-2xl font-bold">{currency(active.price)}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {active.digital && "Digital"} {active.physical && "+ หนังสือจริง"}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className={`${SITE.theme.accent} gap-2`} onClick={() => addToCart(active.id)}>
                      <ShoppingCart className="h-4 w-4" /> เพิ่มลงตะกร้า
                    </Button>
                    {active.downloadSample && (
                      <a href={active.downloadSample} target="_blank">
                        <Button variant="outline">ดูตัวอย่าง</Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
