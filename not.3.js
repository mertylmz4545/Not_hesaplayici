let butunlemeGirdi = false;
// Global değişkenler harfNotu, durum, aciklama tanımlanmalı (Kodunuzun tamamı olmadığı için burada tanımladım)
let harfNotu = ""; 
let durum = false; 
let aciklama = "";

document.addEventListener('DOMContentLoaded', () => {
    butunlemeKontrol();
    sonucGizle();
});

function butunlemeKontrol() {
    const finalLabel = document.getElementById("finallabel");
    const finalInput = document.getElementById("final");
    const butunlemeInput = document.getElementById("butunleme");
   
    if (butunlemeInput.value.trim() !== "") {
        finalLabel.style.display = "none";
        finalInput.style.display = "none";
        finalInput.value = ""; 
        butunlemeGirdi = true;
    } else {
        finalLabel.style.display = "block"; // block olarak düzeltildi
        finalInput.style.display = "block"; // block olarak düzeltildi
        butunlemeGirdi = false;
    }
}

function hesapla() {
    sonucGizle(); 
    document.getElementById("uyari").style.display = "none";

    const devamDurumu = document.getElementById("devam") ? document.getElementById("devam").checked : true; // Devam checkbox'ı silinmiş olabilir
    const sinavaGirdi = document.getElementById("sinavgirdin") ? document.getElementById("sinavgirdin").checked : true; // Sınav checkbox'ı silinmiş olabilir

    // --- Notları Oku ---
    const vizeNotu = parseFloat(document.getElementById("vize").value);
    let yilIciNotu = parseFloat(document.getElementById("yilici").value);
    const finalNotu = parseFloat(document.getElementById("final").value);
    const butunlemeNotu = parseFloat(document.getElementById("butunleme").value);

    // --- Devam Kontrolü (F1) ---
    if (!devamDurumu) {
        harfNotu = "F1";
        aciklama = "Devamsızlıktan Kaldınız (F1)";
        durum = false;
        // F1/F2 durumunda notları göstermemek için 0 geçilir
        sonucGoster(harfNotu, durum, aciklama, 0, 0, 0); 
        return;
    }
    
    // --- Sınav Giriş Kontrolü (F2) ---
    if (!sinavaGirdi) {
        harfNotu = "F2";
        aciklama = "Genel/Bütünleme Sınavına Girmediğiniz İçin Kaldınız (F2)";
        durum = false;
        sonucGoster(harfNotu, durum, aciklama, 0, 0, 0);
        return;
    }
    
    // --- Boş Not Kontrolü ---
    if (isNaN(vizeNotu)) {
        uyariGoster("Uyarı: Vize Notu Giriniz.");
        return;
    }

    if (isNaN(finalNotu) && !butunlemeGirdi) {
        uyariGoster("Uyarı: Final Notu Giriniz.");
        return;
    }

    // --- Not Aralığı Kontrolü (0-100) ---
    const notlar = [vizeNotu, finalNotu, butunlemeNotu, yilIciNotu].filter(n => !isNaN(n));

    if (notlar.some(n => n < 0 || n > 100)) {
        uyariGoster("Uyarı: Notlar 0 ile 100 arasında olmalıdır.");
        return;
    }
    
    // --- Hesaplama Mantığı ---
    if (isNaN(yilIciNotu)) {
        yilIciNotu = vizeNotu; 
    }

    const donemSonuNotu = butunlemeGirdi ? butunlemeNotu : finalNotu;
    const sinavNotu = donemSonuNotu; 
    const basariNotu = yilIciNotu * 0.4 + sinavNotu * 0.6; 

    // --- Harf Notu Karar Ağacı ---
    if (sinavNotu < 50) {
        harfNotu = "F3";
        durum = false;
        aciklama = "Genel/Bütünleme Sınav Notu 50'nin Altında (F3)";
    } else if (basariNotu < 60) {
        harfNotu = "F3";
        durum = false;
        aciklama = "Başarı Notu 60'ın Altında (F3)";
    } else if (basariNotu >= 60 && basariNotu <= 64) {
        harfNotu = "C2 (2.50)";
        aciklama = "Başarı Notu 60 ve Üstü";
        durum = true;
    } else if (basariNotu >= 65 && basariNotu <= 69) {
        harfNotu = "B2 (2.75)";
        aciklama = "Başarı Notu 65 ve Üstü";
        durum = true;
    } else if (basariNotu >= 70 && basariNotu <= 79) {
        harfNotu = "B1 (3.00)";
        aciklama = "Başarı Notu 70 ve Üstü";
        durum = true;
    } else if (basariNotu >= 80 && basariNotu <= 89) {
        harfNotu = "A2 (3.50)";
        aciklama = "Başarı Notu 80 ve Üstü";
        durum = true;
    } else if (basariNotu >= 90 && basariNotu <= 100) { 
        harfNotu = "A1 (4.00)";
        aciklama = "Başarı Notu 90 ve Üstü";
        durum = true;
    } else {
        harfNotu = "-";
        aciklama = "Not Hesaplanamadı";
        durum = false;
    }

    // --- Sonuçları Ekrana Yazma (Tüm notlar gönderildi) ---
    sonucGoster(harfNotu, durum, aciklama, basariNotu, sinavNotu, vizeNotu);
}

// --- Yardımcı Fonksiyonlar ---

function uyariGoster(mesaj) {
    document.getElementById("uyari").innerText = mesaj;
    document.getElementById("uyari").style.display = "block";
}

function resetForm() {
    document.getElementById("notForm").reset();
    document.getElementById("finallabel").style.display = "block";
    document.getElementById("final").style.display = "block";
    butunlemeGirdi = false;
    sonucGizle();
    document.getElementById("uyari").style.display = "none";
}

function sonucGizle() {
    // KRİTİK: Ana kutuyu gizle
    document.getElementById("sonucKutusu").style.display = "none"; 
    
    // İç elemanları da gizleyelim (temizlik için)
    document.getElementById("basariNotu").style.display = "none";
    document.getElementById("toplamNot").style.display = "none";
    document.getElementById("durum").style.display = "none";
    document.getElementById("aciklama").style.display = "none";
}

// --- SONUÇLARI GÖSTERME (TEK VE DOĞRU KULLANIM) ---
function sonucGoster(harfNotu, durum, aciklama, basariNotu = 0, sinavNotu = 0, vizeNotu = 0) { 
    const sinavTuru = butunlemeGirdi ? "Bütünleme Notu" : "Final Notu";

    document.getElementById("basariNotu").innerText = "Başarı Notunuz (Yıl İçi %40 - D. Sonu %60): " + basariNotu.toFixed(2);
    document.getElementById("toplamNot").innerText = "Harf Notu Karşılığı: " + harfNotu; 
    document.getElementById("durum").innerText = "Durum: " + (durum ? "GEÇTİ" : "KALDI");

    // Vize Notu ve Sınav Notu Açıklama alanında gösteriliyor.
    document.getElementById("aciklama").innerText = 
        `Açıklama: ${aciklama} | Vize Notu: ${vizeNotu} | ${sinavTuru}: ${sinavNotu}`;
    
    // KRİTİK: Ana kutuyu göster
    document.getElementById("sonucKutusu").style.display = "block"; 
    
    // İçindeki tüm elemanları göster
    document.getElementById("basariNotu").style.display = "block";
    document.getElementById("toplamNot").style.display = "block";
    document.getElementById("durum").style.display = "block";
    document.getElementById("aciklama").style.display = "block";
    
    // Renklendirme
    document.getElementById("durum").style.color = durum ? "green" : "red";
    document.getElementById("durum").style.fontWeight = "bold";
}