import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  Upload, 
  PenLine, 
  BarChart3, 
  Shield, 
  Zap, 
  Users,
  Sparkles,
  Check,
  Play,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    className={className}
  >
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className="w-full h-full rounded-full bg-primary/10 blur-xl"
    />
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, index }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-card rounded-3xl border border-border p-8 shadow-card hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="relative w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow"
      >
        <Icon className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      
      <h3 className="relative text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="relative text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

const StepCard = ({ step, title, description, index }: {
  step: string;
  title: string;
  description: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative flex items-start gap-6"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        <span className="text-3xl font-bold text-primary">{step}</span>
      </motion.div>
      <div className="pt-2">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {index < 2 && (
        <div className="absolute left-10 top-24 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      )}
    </motion.div>
  );
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const features = [
    {
      icon: Upload,
      title: 'Import Excel',
      description: 'Tải lên file Excel chứa bộ câu hỏi một cách nhanh chóng và dễ dàng'
    },
    {
      icon: PenLine,
      title: 'Tự tạo câu hỏi',
      description: 'Tạo bộ câu hỏi trắc nghiệm với giao diện thân thiện, dễ sử dụng'
    },
    {
      icon: BarChart3,
      title: 'Thống kê chi tiết',
      description: 'Theo dõi tiến độ học tập với biểu đồ và phân tích chi tiết'
    },
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Dữ liệu được bảo vệ an toàn với hệ thống xác thực hiện đại'
    },
    {
      icon: Zap,
      title: 'Siêu nhanh',
      description: 'Giao diện tối ưu, phản hồi nhanh chóng trên mọi thiết bị'
    },
    {
      icon: Users,
      title: 'Chia sẻ dễ dàng',
      description: 'Chia sẻ bộ câu hỏi với bạn bè và đồng nghiệp một cách thuận tiện'
    }
  ];

  const steps = [
    { step: '01', title: 'Tạo hoặc Import câu hỏi', description: 'Upload file Excel hoặc tự tạo câu hỏi với công cụ trực quan' },
    { step: '02', title: 'Cài đặt bài thi', description: 'Chọn số câu, chủ đề, thời gian làm bài theo ý muốn' },
    { step: '03', title: 'Làm bài & Xem kết quả', description: 'Hoàn thành bài thi và nhận phân tích chi tiết ngay lập tức' }
  ];

  const testimonials = [
    { name: 'Minh Anh', role: 'Sinh viên', content: 'EduQuiz giúp mình ôn thi hiệu quả hơn rất nhiều!', rating: 5 },
    { name: 'Hoàng Nam', role: 'Giáo viên', content: 'Công cụ tuyệt vời để tạo bài kiểm tra cho học sinh.', rating: 5 },
    { name: 'Thu Hà', role: 'Học sinh', content: 'Giao diện đẹp, dễ sử dụng. Rất thích!', rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50"
      >
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">EduQuiz</span>
          </motion.div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/quiz')} className="gap-2 shadow-lg">
                Vào ứng dụng
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex">
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate('/auth')} className="gap-2 shadow-lg">
                  Bắt đầu miễn phí
                  <Sparkles className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingShape className="absolute top-20 left-[10%] w-72 h-72" delay={0} />
          <FloatingShape className="absolute top-40 right-[15%] w-96 h-96" delay={0.3} />
          <FloatingShape className="absolute bottom-20 left-[20%] w-64 h-64" delay={0.6} />
          <FloatingShape className="absolute bottom-40 right-[25%] w-48 h-48" delay={0.9} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="container max-w-6xl mx-auto px-4 py-20 text-center relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng ôn tập #1 Việt Nam</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.2, delay: 0.3 }}
            className="w-28 h-28 mx-auto mb-8 gradient-primary rounded-3xl flex items-center justify-center shadow-glow"
          >
            <GraduationCap className="w-14 h-14 text-primary-foreground" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-gradient">EduQuiz</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            Nền tảng ôn tập trắc nghiệm thông minh
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-foreground font-medium mb-10"
          >
            Học tập hiệu quả • Đạt kết quả cao • Tiết kiệm thời gian
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/quiz' : '/auth')}
                className="gap-3 text-lg px-10 h-16 gradient-primary text-primary-foreground shadow-glow hover:shadow-xl transition-shadow"
              >
                <Play className="w-5 h-5" />
                {user ? 'Vào ứng dụng' : 'Bắt đầu ngay'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/quiz')}
                className="gap-3 text-lg px-10 h-16 bg-background/50 backdrop-blur-sm"
              >
                Dùng thử miễn phí
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '10K+', label: 'Câu hỏi' },
              { value: '5K+', label: 'Người dùng' },
              { value: '99%', label: 'Hài lòng' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-3 rounded-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container max-w-6xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              Tính năng
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Mọi thứ bạn cần</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Công cụ học tập toàn diện giúp bạn ôn tập hiệu quả
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-card/50">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              Hướng dẫn
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Chỉ 3 bước đơn giản</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bắt đầu ôn tập ngay lập tức với quy trình đơn giản
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <StepCard key={step.step} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              Đánh giá
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Người dùng nói gì?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <FloatingShape className="absolute top-10 left-[10%] w-64 h-64" delay={0} />
        <FloatingShape className="absolute bottom-10 right-[10%] w-48 h-48" delay={0.5} />
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
              className="w-20 h-20 mx-auto mb-8 gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Tham gia cùng hàng nghìn người dùng đang sử dụng EduQuiz để ôn tập hiệu quả
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                onClick={() => navigate(user ? '/quiz' : '/auth')}
                className="gap-3 text-lg px-12 h-16 gradient-primary text-primary-foreground shadow-glow hover:shadow-xl transition-shadow"
              >
                Bắt đầu miễn phí ngay
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">EduQuiz</span>
                <p className="text-sm text-muted-foreground">Được xây dựng bởi <span className="font-medium text-foreground">Huynh Khuan</span></p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Giới thiệu</a>
              <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
              <a href="#" className="hover:text-primary transition-colors">Chính sách</a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 EduQuiz - Nền tảng ôn tập trắc nghiệm thông minh. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;