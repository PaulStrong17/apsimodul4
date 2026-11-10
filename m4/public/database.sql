SET search_path TO public;          
SET datestyle TO 'ISO, YMD';        

BEGIN;

DROP TABLE IF EXISTS Hasil_QC_Hasil_Produksi;
DROP TABLE IF EXISTS Tindakan_Perbaikan;
DROP TABLE IF EXISTS Hasil_Pemeriksaan_QC;
DROP TABLE IF EXISTS Jadwal_Pemeriksaan_QC;
DROP TABLE IF EXISTS Hasil_Produksi;
DROP TABLE IF EXISTS Jadwal_Produksi;
DROP TABLE IF EXISTS Permintaan_Produk;
DROP TABLE IF EXISTS Detail_Resep;
DROP TABLE IF EXISTS Resep;
DROP TABLE IF EXISTS Penerimaan_Bahan_Baku;
DROP TABLE IF EXISTS Bahan_Baku;
DROP TABLE IF EXISTS Jenis_Supplier;
DROP TABLE IF EXISTS Nama_Supplier;
DROP TABLE IF EXISTS Produk;
DROP TABLE IF EXISTS Laporan;
DROP TABLE IF EXISTS Laporan_Jenis;
DROP TABLE IF EXISTS Karyawan_QC;
DROP TABLE IF EXISTS Karyawan_Produksi;
DROP TABLE IF EXISTS Owner;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Pengguna;

COMMIT;

BEGIN;


-- Pengguna: akun login semua peran
CREATE TABLE Pengguna (
    id_pengguna    VARCHAR(10)  NOT NULL,
    nama_lengkap   VARCHAR(100) NOT NULL,
    username       VARCHAR(50)  NOT NULL,
    password       VARCHAR(255) NOT NULL,
    role           VARCHAR(30)  NOT NULL,
    status_aktif   BOOLEAN      NOT NULL DEFAULT TRUE,   -- "bit" di ERD
    email_pengguna VARCHAR(100) NOT NULL,
    CONSTRAINT pk_pengguna PRIMARY KEY (id_pengguna),
    CONSTRAINT uq_pengguna_username UNIQUE (username),
    CONSTRAINT uq_pengguna_email UNIQUE (email_pengguna),
    CONSTRAINT ck_pengguna_role CHECK (role IN
        ('Admin', 'Owner', 'Karyawan Produksi', 'Karyawan QC'))
);

-- Admin: Pengguna berperan admin 
CREATE TABLE Admin (
    id_admin    VARCHAR(10) NOT NULL,
    id_pengguna VARCHAR(10) NOT NULL,
    CONSTRAINT pk_admin PRIMARY KEY (id_admin),
    CONSTRAINT fk_admin_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES Pengguna (id_pengguna)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Owner
CREATE TABLE Owner (
    id_owner    VARCHAR(10) NOT NULL,
    id_pengguna VARCHAR(10) NOT NULL,
    CONSTRAINT pk_owner PRIMARY KEY (id_owner),
    CONSTRAINT fk_owner_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES Pengguna (id_pengguna)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Karyawan_Produksi
CREATE TABLE Karyawan_Produksi (
    id_karyawanproduksi VARCHAR(10) NOT NULL,
    id_pengguna         VARCHAR(10) NOT NULL,
    CONSTRAINT pk_karyawan_produksi PRIMARY KEY (id_karyawanproduksi),
    CONSTRAINT fk_karyawan_produksi_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES Pengguna (id_pengguna)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Karyawan_QC
CREATE TABLE Karyawan_QC (
    id_karyawanqc VARCHAR(10) NOT NULL,
    id_pengguna   VARCHAR(10) NOT NULL,
    CONSTRAINT pk_karyawan_qc PRIMARY KEY (id_karyawanqc),
    CONSTRAINT fk_karyawan_qc_pengguna FOREIGN KEY (id_pengguna)
        REFERENCES Pengguna (id_pengguna)
        ON UPDATE CASCADE ON DELETE RESTRICT
);


-- Laporan_Jenis: jenis laporan 
CREATE TABLE Laporan_Jenis (
    jenis_laporan          VARCHAR(50)  NOT NULL,
    hasil_tindakanperbaikan VARCHAR(255) NOT NULL,
    status_pencapaian      VARCHAR(30)  NOT NULL,
    CONSTRAINT pk_laporan_jenis PRIMARY KEY (jenis_laporan),
    CONSTRAINT ck_laporan_jenis_status CHECK (status_pencapaian IN
        ('Tercapai', 'Belum tercapai'))
);

-- Laporan
CREATE TABLE Laporan (
    id_laporan         INTEGER       NOT NULL,
    periode_awal       DATE          NOT NULL,
    periode_akhir      DATE          NOT NULL,
    total_produksi     INTEGER       NOT NULL,
    jumlah_pemeriksaan INTEGER       NOT NULL,
    reject_rate        NUMERIC(5,2)  NOT NULL,
    target_reject_rate NUMERIC(5,2)  NOT NULL,
    status_pencapaian  VARCHAR(30)   NOT NULL,
    id_admin           VARCHAR(10)   NOT NULL,
    id_owner           VARCHAR(10)   NOT NULL,
    CONSTRAINT pk_laporan PRIMARY KEY (id_laporan),
    CONSTRAINT ck_laporan_periode CHECK (periode_akhir >= periode_awal),
    CONSTRAINT ck_laporan_angka CHECK (total_produksi >= 0 AND jumlah_pemeriksaan >= 0
        AND reject_rate >= 0 AND target_reject_rate >= 0),
    CONSTRAINT ck_laporan_status CHECK (status_pencapaian IN
        ('Tercapai', 'Belum tercapai')),
    CONSTRAINT fk_laporan_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_laporan_owner FOREIGN KEY (id_owner)
        REFERENCES Owner (id_owner)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Nama_Supplier (PK = nama_supplier sesuai ERD)
CREATE TABLE Nama_Supplier (
    nama_supplier VARCHAR(100) NOT NULL,
    no_telp       VARCHAR(20)  NOT NULL,
    alamat        VARCHAR(255) NOT NULL,
    CONSTRAINT pk_nama_supplier PRIMARY KEY (nama_supplier)
);

-- Jenis_Supplier (id_supplier = PK, nama_supplier = FK)
CREATE TABLE Jenis_Supplier (
    id_supplier   VARCHAR(10)  NOT NULL,
    jenis_supplier VARCHAR(50) NOT NULL,
    nama_supplier VARCHAR(100) NOT NULL,
    id_admin      VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_jenis_supplier PRIMARY KEY (id_supplier),
    CONSTRAINT fk_jenis_supplier_nama FOREIGN KEY (nama_supplier)
        REFERENCES Nama_Supplier (nama_supplier)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jenis_supplier_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Bahan_Baku
CREATE TABLE Bahan_Baku (
    id_bahan     VARCHAR(10)   NOT NULL,
    nama_bahan   VARCHAR(100)  NOT NULL,
    satuan       VARCHAR(20)   NOT NULL,
    stok         NUMERIC(10,2) NOT NULL DEFAULT 0,
    stok_minimum NUMERIC(10,2) NOT NULL DEFAULT 0,
    id_admin     VARCHAR(10)   NOT NULL,
    CONSTRAINT pk_bahan_baku PRIMARY KEY (id_bahan),
    CONSTRAINT ck_bahan_baku_stok CHECK (stok >= 0 AND stok_minimum >= 0),
    CONSTRAINT fk_bahan_baku_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Penerimaan_Bahan_Baku
CREATE TABLE Penerimaan_Bahan_Baku (
    id_penerimaan          VARCHAR(10)   NOT NULL,
    tanggal_terima         DATE          NOT NULL,
    jumlah_diterima        NUMERIC(10,2) NOT NULL,
    keterangan_penerimaan  VARCHAR(255)  NOT NULL,
    id_supplier            VARCHAR(10)   NOT NULL,
    id_bahan               VARCHAR(10)   NOT NULL,
    id_admin               VARCHAR(10)   NOT NULL,
    CONSTRAINT pk_penerimaan_bahan_baku PRIMARY KEY (id_penerimaan),
    CONSTRAINT ck_penerimaan_jumlah CHECK (jumlah_diterima > 0),
    CONSTRAINT fk_penerimaan_supplier FOREIGN KEY (id_supplier)
        REFERENCES Jenis_Supplier (id_supplier)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_penerimaan_bahan FOREIGN KEY (id_bahan)
        REFERENCES Bahan_Baku (id_bahan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_penerimaan_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Produk
CREATE TABLE Produk (
    id_produk    VARCHAR(10)  NOT NULL,
    nama_produk  VARCHAR(100) NOT NULL,
    varian       VARCHAR(50)  NOT NULL,
    stok_produk  INTEGER      NOT NULL DEFAULT 0,
    resep_produk VARCHAR(255) NOT NULL,
    id_admin     VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_produk PRIMARY KEY (id_produk),
    CONSTRAINT ck_produk_stok CHECK (stok_produk >= 0),
    CONSTRAINT fk_produk_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Resep
CREATE TABLE Resep (
    id_resep       VARCHAR(10)  NOT NULL,
    deskripsi_resep VARCHAR(255) NOT NULL,
    id_produk      VARCHAR(10)  NOT NULL,
    id_admin       VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_resep PRIMARY KEY (id_resep),
    CONSTRAINT fk_resep_produk FOREIGN KEY (id_produk)
        REFERENCES Produk (id_produk)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_resep_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Detail_Resep (resep <-> bahan baku)
CREATE TABLE Detail_Resep (
    id_detailresep VARCHAR(10) NOT NULL,
    id_resep       VARCHAR(10) NOT NULL,
    id_bahan       VARCHAR(10) NOT NULL,
    CONSTRAINT pk_detail_resep PRIMARY KEY (id_detailresep),
    CONSTRAINT fk_detail_resep_resep FOREIGN KEY (id_resep)
        REFERENCES Resep (id_resep)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_detail_resep_bahan FOREIGN KEY (id_bahan)
        REFERENCES Bahan_Baku (id_bahan)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Permintaan_Produk
CREATE TABLE Permintaan_Produk (
    id_permintaan         VARCHAR(10)  NOT NULL,
    tanggal_permintaan    DATE         NOT NULL,
    jumlah_diminta        INTEGER      NOT NULL,
    keterangan_permintaan VARCHAR(255) NOT NULL,
    status_permintaan     VARCHAR(30)  NOT NULL DEFAULT 'Menunggu',
    id_produk             VARCHAR(10)  NOT NULL,
    id_admin              VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_permintaan_produk PRIMARY KEY (id_permintaan),
    CONSTRAINT ck_permintaan_jumlah CHECK (jumlah_diminta > 0),
    CONSTRAINT ck_permintaan_status CHECK (status_permintaan IN
        ('Menunggu', 'Disetujui', 'Ditolak')),
    CONSTRAINT fk_permintaan_produk FOREIGN KEY (id_produk)
        REFERENCES Produk (id_produk)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_permintaan_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Jadwal_Produksi
CREATE TABLE Jadwal_Produksi (
    id_jadwalproduksi   VARCHAR(10) NOT NULL,
    tanggal_produksi    DATE        NOT NULL,
    jumlah_target       INTEGER     NOT NULL,
    status_verifikasi   VARCHAR(30) NOT NULL DEFAULT 'Menunggu',
    status_jadwal       VARCHAR(30) NOT NULL DEFAULT 'Direncanakan',
    id_admin            VARCHAR(10) NOT NULL,
    id_permintaan       VARCHAR(10) NOT NULL,
    id_owner            VARCHAR(10) NOT NULL,
    id_karyawanqc       VARCHAR(10) NOT NULL,
    id_karyawanproduksi VARCHAR(10) NOT NULL,
    CONSTRAINT pk_jadwal_produksi PRIMARY KEY (id_jadwalproduksi),
    CONSTRAINT ck_jadwal_produksi_target CHECK (jumlah_target > 0),
    CONSTRAINT ck_jadwal_produksi_verif CHECK (status_verifikasi IN
        ('Menunggu', 'Terverifikasi', 'Ditolak')),
    CONSTRAINT ck_jadwal_produksi_status CHECK (status_jadwal IN
        ('Direncanakan', 'Terjadwal', 'Selesai', 'Dibatalkan')),
    CONSTRAINT fk_jadwal_produksi_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_produksi_permintaan FOREIGN KEY (id_permintaan)
        REFERENCES Permintaan_Produk (id_permintaan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_produksi_owner FOREIGN KEY (id_owner)
        REFERENCES Owner (id_owner)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_produksi_karyawanqc FOREIGN KEY (id_karyawanqc)
        REFERENCES Karyawan_QC (id_karyawanqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_produksi_karyawanproduksi FOREIGN KEY (id_karyawanproduksi)
        REFERENCES Karyawan_Produksi (id_karyawanproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Hasil_Produksi
CREATE TABLE Hasil_Produksi (
    id_hasil            VARCHAR(10)  NOT NULL,
    tanggal_pencatatan  DATE         NOT NULL,
    jumlah_hasil        INTEGER      NOT NULL,
    keterangan          VARCHAR(255) NOT NULL,
    id_jadwalproduksi   VARCHAR(10)  NOT NULL,
    id_karyawanproduksi VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_hasil_produksi PRIMARY KEY (id_hasil),
    CONSTRAINT ck_hasil_produksi_jumlah CHECK (jumlah_hasil >= 0),
    CONSTRAINT fk_hasil_produksi_jadwal FOREIGN KEY (id_jadwalproduksi)
        REFERENCES Jadwal_Produksi (id_jadwalproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hasil_produksi_karyawan FOREIGN KEY (id_karyawanproduksi)
        REFERENCES Karyawan_Produksi (id_karyawanproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT
);


-- Jadwal_Pemeriksaan_QC (4 kolom bertanda N di ERD -> boleh NULL)
CREATE TABLE Jadwal_Pemeriksaan_QC (
    id_jadwalqc         VARCHAR(10)  NOT NULL,
    tanggal_pemeriksaan DATE,
    jenis_pemeriksaan   VARCHAR(255),
    status_verifikasi   VARCHAR(30),
    status_pemeriksaan  VARCHAR(30),
    id_jadwalproduksi   VARCHAR(10)  NOT NULL,
    id_admin            VARCHAR(10)  NOT NULL,
    id_owner            VARCHAR(10)  NOT NULL,
    id_karyawanqc       VARCHAR(10)  NOT NULL,
    id_karyawanproduksi VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_jadwal_pemeriksaan_qc PRIMARY KEY (id_jadwalqc),
    CONSTRAINT ck_jadwal_qc_verif CHECK (status_verifikasi IN
        ('Menunggu', 'Terverifikasi', 'Ditolak')),
    CONSTRAINT ck_jadwal_qc_status CHECK (status_pemeriksaan IN
        ('Direncanakan', 'Terjadwal', 'Selesai', 'Dibatalkan')),
    CONSTRAINT fk_jadwal_qc_jadwalproduksi FOREIGN KEY (id_jadwalproduksi)
        REFERENCES Jadwal_Produksi (id_jadwalproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_qc_admin FOREIGN KEY (id_admin)
        REFERENCES Admin (id_admin)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_qc_owner FOREIGN KEY (id_owner)
        REFERENCES Owner (id_owner)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_qc_karyawanqc FOREIGN KEY (id_karyawanqc)
        REFERENCES Karyawan_QC (id_karyawanqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_qc_karyawanproduksi FOREIGN KEY (id_karyawanproduksi)
        REFERENCES Karyawan_Produksi (id_karyawanproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Hasil_Pemeriksaan_QC
CREATE TABLE Hasil_Pemeriksaan_QC (
    id_hasilqc         VARCHAR(10)  NOT NULL,
    tanggal_pencatatan DATE         NOT NULL,
    jumlah_diperiksa   INTEGER      NOT NULL,
    jumlah_lolos       INTEGER      NOT NULL,
    jumlah_reject      INTEGER      NOT NULL,
    keterangan         VARCHAR(255) NOT NULL,
    id_jadwalqc        VARCHAR(10)  NOT NULL,
    id_karyawanqc      VARCHAR(10)  NOT NULL,
    id_laporan         INTEGER,                 -- diisi setelah laporan dibuat
    jenis_laporan      VARCHAR(50),             -- diisi setelah laporan dibuat
    CONSTRAINT pk_hasil_pemeriksaan_qc PRIMARY KEY (id_hasilqc),
    CONSTRAINT ck_hasil_qc_jumlah CHECK (jumlah_diperiksa >= 0 AND jumlah_lolos >= 0
        AND jumlah_reject >= 0),
    CONSTRAINT ck_hasil_qc_total CHECK (jumlah_lolos + jumlah_reject = jumlah_diperiksa),
    CONSTRAINT fk_hasil_qc_jadwalqc FOREIGN KEY (id_jadwalqc)
        REFERENCES Jadwal_Pemeriksaan_QC (id_jadwalqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hasil_qc_karyawanqc FOREIGN KEY (id_karyawanqc)
        REFERENCES Karyawan_QC (id_karyawanqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hasil_qc_laporan FOREIGN KEY (id_laporan)
        REFERENCES Laporan (id_laporan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hasil_qc_jenis_laporan FOREIGN KEY (jenis_laporan)
        REFERENCES Laporan_Jenis (jenis_laporan)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Hasil_QC_Hasil_Produksi (tabel penghubung many-to-many, PK gabungan)
CREATE TABLE Hasil_QC_Hasil_Produksi (
    id_hasilqc VARCHAR(10) NOT NULL,
    id_hasil   VARCHAR(10) NOT NULL,
    CONSTRAINT pk_hasil_qc_hasil_produksi PRIMARY KEY (id_hasilqc, id_hasil),
    CONSTRAINT fk_hqhp_hasilqc FOREIGN KEY (id_hasilqc)
        REFERENCES Hasil_Pemeriksaan_QC (id_hasilqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hqhp_hasil FOREIGN KEY (id_hasil)
        REFERENCES Hasil_Produksi (id_hasil)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tindakan_Perbaikan (5 kolom bertanda N di ERD -> boleh NULL)
CREATE TABLE Tindakan_Perbaikan (
    id_tindakan         VARCHAR(10)  NOT NULL,
    deskripsi_tindakan  VARCHAR(255),
    tanggal_tindakan    DATE,
    status              VARCHAR(30),
    keterangan          VARCHAR(255),
    hasil_tindakan      VARCHAR(255),
    id_hasilqc          VARCHAR(10)  NOT NULL,
    id_owner            VARCHAR(10)  NOT NULL,
    id_laporan          INTEGER,
    jenis_laporan       VARCHAR(50),
    id_karyawanqc       VARCHAR(10)  NOT NULL,
    id_karyawanproduksi VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_tindakan_perbaikan PRIMARY KEY (id_tindakan),
    CONSTRAINT ck_tindakan_status CHECK (status IN
        ('Direncanakan', 'Proses', 'Selesai')),
    CONSTRAINT fk_tindakan_hasilqc FOREIGN KEY (id_hasilqc)
        REFERENCES Hasil_Pemeriksaan_QC (id_hasilqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tindakan_owner FOREIGN KEY (id_owner)
        REFERENCES Owner (id_owner)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tindakan_laporan FOREIGN KEY (id_laporan)
        REFERENCES Laporan (id_laporan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tindakan_jenis_laporan FOREIGN KEY (jenis_laporan)
        REFERENCES Laporan_Jenis (jenis_laporan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tindakan_karyawanqc FOREIGN KEY (id_karyawanqc)
        REFERENCES Karyawan_QC (id_karyawanqc)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tindakan_karyawanproduksi FOREIGN KEY (id_karyawanproduksi)
        REFERENCES Karyawan_Produksi (id_karyawanproduksi)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMIT;

BEGIN;

-- Pengguna
INSERT INTO Pengguna (id_pengguna, nama_lengkap, username, password, role, status_aktif, email_pengguna) VALUES
('A01', 'Aisyah Dwina Putri', 'aisyah', md5('2037'), 'Admin', TRUE, 'aisyah@keripikcabe.co.id'),
('A02', 'Yaffiq Arsya Ghazali', 'arsya', md5('3001'), 'Owner', TRUE, 'arsya@keripikcabe.co.id'),
('A03', 'M. Raffa Fahrezi', 'raffa', md5('1017'), 'Karyawan Produksi', TRUE, 'raffa@keripikcabe.co.id'),
('A04', 'Rizky Dinu Putra', 'rizky', md5('2006'), 'Karyawan QC', TRUE, 'rizky@keripikcabe.co.id'),
('A05', 'Handika Kurniawan', 'dika', md5('7001'), 'Karyawan Produksi', TRUE, 'dika@keripikcabe.co.id');

-- Peran
INSERT INTO Admin             (id_admin, id_pengguna)            VALUES ('AD01', 'A01');
INSERT INTO Owner             (id_owner, id_pengguna)            VALUES ('OW01', 'A02');
INSERT INTO Karyawan_Produksi (id_karyawanproduksi, id_pengguna) VALUES ('KP01', 'A03');
INSERT INTO Karyawan_QC       (id_karyawanqc, id_pengguna)       VALUES ('KQ01', 'A04');
INSERT INTO Karyawan_Produksi (id_karyawanproduksi, id_pengguna) VALUES ('KP02', 'A05');

-- Laporan_Jenis
INSERT INTO Laporan_Jenis (jenis_laporan, hasil_tindakanperbaikan, status_pencapaian) VALUES
('Laporan Hasil QC', 'Produksi ulang, kemas ulang, penggorengan ulang', 'Belum tercapai');

-- Laporan
INSERT INTO Laporan (id_laporan, periode_awal, periode_akhir, total_produksi, jumlah_pemeriksaan,
                     reject_rate, target_reject_rate, status_pencapaian, id_admin, id_owner) VALUES
(1, '2026-06-01', '2026-06-30', 200, 200, 6.00, 5.00, 'Belum tercapai', 'AD01', 'OW01'),
(2, '2026-08-01', '2026-08-31', 150, 150, 4.00, 5.00, 'Tercapai',       'AD01', 'OW01');

-- Nama_Supplier & Jenis_Supplier
INSERT INTO Nama_Supplier (nama_supplier, no_telp, alamat) VALUES
('CV Cabe Sumatera', '0812-1111-2222', 'Jl. Sudirman No. 12, Bukittinggi'),
('UD Sinar Pangan',  '0813-3333-4444', 'Jl. Khatib Sulaiman No. 5, Padang');

INSERT INTO Jenis_Supplier (id_supplier, jenis_supplier, nama_supplier, id_admin) VALUES
('S01', 'Bahan Baku',            'CV Cabe Sumatera', 'AD01'),
('S02', 'Bahan Baku & Kemasan',  'UD Sinar Pangan',  'AD01');

-- Bahan_Baku
INSERT INTO Bahan_Baku (id_bahan, nama_bahan, satuan, stok, stok_minimum, id_admin) VALUES
('B01', 'Cabai Merah Keriting', 'kg',    120,  50,  'AD01'),
('B02', 'Minyak Goreng',        'liter',  60,  30,  'AD01'),
('B03', 'Tepung Beras',         'kg',     80,  40,  'AD01'),
('B04', 'Kemasan Plastik',      'pcs',  1500, 500,  'AD01');

-- Penerimaan_Bahan_Baku
INSERT INTO Penerimaan_Bahan_Baku (id_penerimaan, tanggal_terima, jumlah_diterima, keterangan_penerimaan,
                                   id_supplier, id_bahan, id_admin) VALUES
('PB001', '2026-01-10',  50, 'Kondisi baik', 'S01', 'B01', 'AD01'),
('PB002', '2026-01-10',  20, 'Kondisi baik', 'S01', 'B02', 'AD01'),
('PB003', '2026-01-10',  15, 'Kondisi baik', 'S01', 'B03', 'AD01'),
('PB004', '2026-04-10',  30, 'Kondisi baik', 'S02', 'B01', 'AD01'),
('PB005', '2026-04-10', 500, 'Kondisi baik', 'S02', 'B04', 'AD01');

-- Produk
INSERT INTO Produk (id_produk, nama_produk, varian, stok_produk, resep_produk, id_admin) VALUES
('P01', 'Keripik Cabe Original', 'Pedas Sedang', 350, 'Adonan tepung beras, digoreng, bumbu cabai merah', 'AD01'),
('P02', 'Keripik Cabe Balado',   'Pedas Manis',  180, 'Adonan tepung beras, digoreng, bumbu balado',     'AD01');

-- Resep & Detail_Resep
INSERT INTO Resep (id_resep, deskripsi_resep, id_produk, id_admin) VALUES
('R01', 'Resep keripik cabe original pedas sedang', 'P01', 'AD01'),
('R02', 'Resep keripik cabe balado pedas manis',    'P02', 'AD01');

INSERT INTO Detail_Resep (id_detailresep, id_resep, id_bahan) VALUES
('DR001', 'R01', 'B01'),
('DR002', 'R01', 'B02'),
('DR003', 'R01', 'B03'),
('DR004', 'R02', 'B01'),
('DR005', 'R02', 'B02'),
('DR006', 'R02', 'B03');

-- Permintaan_Produk
INSERT INTO Permintaan_Produk (id_permintaan, tanggal_permintaan, jumlah_diminta, keterangan_permintaan,
                               status_permintaan, id_produk, id_admin) VALUES
('PM001', '2026-05-05', 200, 'Stok produk menipis',         'Disetujui', 'P01', 'AD01'),
('PM002', '2026-07-05', 150, 'Pesanan reseller',            'Disetujui', 'P02', 'AD01'),
('PM003', '2026-09-05', 100, 'Persiapan stok akhir tahun',  'Menunggu',  'P01', 'AD01');

-- Jadwal_Produksi
INSERT INTO Jadwal_Produksi (id_jadwalproduksi, tanggal_produksi, jumlah_target, status_verifikasi, status_jadwal,
                             id_admin, id_permintaan, id_owner, id_karyawanqc, id_karyawanproduksi) VALUES
('JP001', '2026-05-10', 200, 'Terverifikasi', 'Selesai',      'AD01', 'PM001', 'OW01', 'KQ01', 'KP01'),
('JP002', '2026-07-10', 150, 'Terverifikasi', 'Selesai',      'AD01', 'PM002', 'OW01', 'KQ01', 'KP01'),
('JP003', '2026-09-10',  50, 'Terverifikasi', 'Terjadwal',    'AD01', 'PM003', 'OW01', 'KQ01', 'KP01'),
('JP004', '2026-09-12',  50, 'Menunggu',      'Direncanakan', 'AD01', 'PM003', 'OW01', 'KQ01', 'KP01');

-- Hasil_Produksi
INSERT INTO Hasil_Produksi (id_hasil, tanggal_pencatatan, jumlah_hasil, keterangan, id_jadwalproduksi, id_karyawanproduksi) VALUES
('HP001', '2026-05-10', 200, 'Produksi sesuai target',            'JP001', 'KP01'),
('HP002', '2026-07-10', 150, 'Produksi sesuai target',            'JP002', 'KP01'),
('HP003', '2026-07-10',   7, 'Hasil produksi ulang (TP001)',      'JP001', 'KP01'),
('HP004', '2026-09-10',   6, 'Hasil penggorengan ulang (TP003)',  'JP002', 'KP01');

-- Jadwal_Pemeriksaan_QC
INSERT INTO Jadwal_Pemeriksaan_QC (id_jadwalqc, tanggal_pemeriksaan, jenis_pemeriksaan, status_verifikasi, status_pemeriksaan,
                                   id_jadwalproduksi, id_admin, id_owner, id_karyawanqc, id_karyawanproduksi) VALUES
('JQ001', '2026-06-10', 'Kerenyahan, warna',             'Terverifikasi', 'Selesai', 'JP001', 'AD01', 'OW01', 'KQ01', 'KP01'),
('JQ002', '2026-08-10', 'Kerenyahan, rasa',              'Terverifikasi', 'Selesai', 'JP002', 'AD01', 'OW01', 'KQ01', 'KP01'),
('JQ003', '2026-07-12', 'Kerenyahan, warna (QC ulang)',  'Terverifikasi', 'Selesai', 'JP001', 'AD01', 'OW01', 'KQ01', 'KP01');

-- Hasil_Pemeriksaan_QC
INSERT INTO Hasil_Pemeriksaan_QC (id_hasilqc, tanggal_pencatatan, jumlah_diperiksa, jumlah_lolos, jumlah_reject,
                                  keterangan, id_jadwalqc, id_karyawanqc, id_laporan, jenis_laporan) VALUES
('HQ001', '2026-06-10', 200, 188, 12, 'Reject: gosong 7, kemasan bocor 5', 'JQ001', 'KQ01', 1,    'Laporan Hasil QC'),
('HQ002', '2026-08-10', 150, 144,  6, 'Reject: kurang renyah 6',           'JQ002', 'KQ01', 2,    'Laporan Hasil QC'),
('HQ003', '2026-07-12',   7,   7,  0, 'QC ulang produk gosong (TP001)',    'JQ003', 'KQ01', NULL, 'Laporan Hasil QC'),
('HQ004', '2026-07-12',   5,   5,  0, 'QC ulang kemasan bocor (TP002)',    'JQ003', 'KQ01', NULL, 'Laporan Hasil QC');

-- Hasil_QC_Hasil_Produksi 
INSERT INTO Hasil_QC_Hasil_Produksi (id_hasilqc, id_hasil) VALUES
('HQ001', 'HP001'),
('HQ002', 'HP002'),
('HQ003', 'HP003'),
('HQ004', 'HP001');

-- Tindakan_Perbaikan
INSERT INTO Tindakan_Perbaikan (id_tindakan, deskripsi_tindakan, tanggal_tindakan, status, keterangan, hasil_tindakan,
                                id_hasilqc, id_owner, id_laporan, jenis_laporan, id_karyawanqc, id_karyawanproduksi) VALUES
('TP001', 'Produksi ulang',      '2026-07-10', 'Selesai', 'Tindakan untuk produk gosong',         'Produk layak jual',          'HQ001', 'OW01', 1, 'Laporan Hasil QC', 'KQ01', 'KP01'),
('TP002', 'Kemas ulang',         '2026-07-10', 'Selesai', 'Tindakan untuk kemasan bocor',         'Kemasan sesuai standar',     'HQ001', 'OW01', 1, 'Laporan Hasil QC', 'KQ01', 'KP01'),
('TP003', 'Penggorengan ulang',  '2026-09-10', 'Selesai', 'Tindakan untuk produk kurang renyah',  'Kerenyahan sesuai standar',  'HQ002', 'OW01', 2, 'Laporan Hasil QC', 'KQ01', 'KP01');

COMMIT;


-- Seluruh data dari sebuah tabel
SELECT * FROM Pengguna;
SELECT * FROM Produk;

-- Kolom tertentu
SELECT id_produk, nama_produk, varian, stok_produk
FROM Produk;

-- WHERE: bahan baku yang stoknya masih di atas stok minimum + 50
SELECT id_bahan, nama_bahan, stok, stok_minimum
FROM Bahan_Baku
WHERE stok > stok_minimum + 50;

-- WHERE: permintaan produk berstatus Disetujui
SELECT id_permintaan, tanggal_permintaan, jumlah_diminta, status_permintaan
FROM Permintaan_Produk
WHERE status_permintaan = 'Disetujui';

-- ORDER BY: hasil QC dari reject terbanyak
SELECT id_hasilqc, tanggal_pencatatan, jumlah_diperiksa, jumlah_reject
FROM Hasil_Pemeriksaan_QC
ORDER BY jumlah_reject DESC, id_hasilqc ASC;


-- INNER JOIN: jadwal produksi + permintaan + produk
SELECT jp.id_jadwalproduksi,
       jp.tanggal_produksi,
       jp.jumlah_target,
       pm.id_permintaan,
       pr.nama_produk,
       pr.varian
FROM Jadwal_Produksi jp
INNER JOIN Permintaan_Produk pm ON pm.id_permintaan = jp.id_permintaan
INNER JOIN Produk pr            ON pr.id_produk     = pm.id_produk
ORDER BY jp.tanggal_produksi;

-- LEFT JOIN: semua bahan baku, termasuk yang belum dipakai di resep
SELECT bb.id_bahan, bb.nama_bahan, dr.id_detailresep, dr.id_resep
FROM Bahan_Baku bb
LEFT JOIN Detail_Resep dr ON dr.id_bahan = bb.id_bahan
ORDER BY bb.id_bahan, dr.id_resep;

-- LEFT JOIN: jadwal produksi yang belum punya hasil produksi
SELECT jp.id_jadwalproduksi, jp.status_jadwal, hp.id_hasil, hp.jumlah_hasil
FROM Jadwal_Produksi jp
LEFT JOIN Hasil_Produksi hp ON hp.id_jadwalproduksi = jp.id_jadwalproduksi
ORDER BY jp.id_jadwalproduksi, hp.id_hasil;

-- JOIN banyak tabel (1): resep -> produk -> bahan baku
SELECT r.id_resep, p.nama_produk, p.varian, bb.nama_bahan, bb.satuan
FROM Resep r
INNER JOIN Produk p        ON p.id_produk  = r.id_produk
INNER JOIN Detail_Resep dr ON dr.id_resep  = r.id_resep
INNER JOIN Bahan_Baku bb   ON bb.id_bahan  = dr.id_bahan
ORDER BY r.id_resep, bb.nama_bahan;

-- JOIN banyak tabel (2): penerimaan bahan baku + supplier + bahan + admin
SELECT pb.id_penerimaan, pb.tanggal_terima, bb.nama_bahan, pb.jumlah_diterima,
       bb.satuan, ns.nama_supplier, ns.no_telp, pg.nama_lengkap AS penerima
FROM Penerimaan_Bahan_Baku pb
INNER JOIN Jenis_Supplier js ON js.id_supplier   = pb.id_supplier
INNER JOIN Nama_Supplier ns  ON ns.nama_supplier = js.nama_supplier
INNER JOIN Bahan_Baku bb     ON bb.id_bahan      = pb.id_bahan
INNER JOIN Admin ad          ON ad.id_admin      = pb.id_admin
INNER JOIN Pengguna pg       ON pg.id_pengguna   = ad.id_pengguna
ORDER BY pb.tanggal_terima, pb.id_penerimaan;

--  JOIN banyak tabel (3): alur tindakan perbaikan sampai ke produk
SELECT tp.id_tindakan, tp.deskripsi_tindakan, tp.status,
       hq.id_hasilqc, hq.jumlah_reject,
       jq.id_jadwalqc, jp.id_jadwalproduksi,
       pr.nama_produk, pg.nama_lengkap AS karyawan_qc
FROM Tindakan_Perbaikan tp
INNER JOIN Hasil_Pemeriksaan_QC hq   ON hq.id_hasilqc       = tp.id_hasilqc
INNER JOIN Jadwal_Pemeriksaan_QC jq  ON jq.id_jadwalqc      = hq.id_jadwalqc
INNER JOIN Jadwal_Produksi jp        ON jp.id_jadwalproduksi = jq.id_jadwalproduksi
INNER JOIN Permintaan_Produk pm      ON pm.id_permintaan    = jp.id_permintaan
INNER JOIN Produk pr                 ON pr.id_produk        = pm.id_produk
INNER JOIN Karyawan_QC kq            ON kq.id_karyawanqc    = tp.id_karyawanqc
INNER JOIN Pengguna pg               ON pg.id_pengguna      = kq.id_pengguna
ORDER BY tp.id_tindakan;

-- JOIN tabel penghubung: hasil QC <-> hasil produksi
SELECT hq.id_hasilqc, hq.keterangan AS ket_qc, hp.id_hasil, hp.jumlah_hasil
FROM Hasil_QC_Hasil_Produksi x
INNER JOIN Hasil_Pemeriksaan_QC hq ON hq.id_hasilqc = x.id_hasilqc
INNER JOIN Hasil_Produksi hp       ON hp.id_hasil   = x.id_hasil
ORDER BY hq.id_hasilqc;


BEGIN;

-- Menyetujui permintaan produk PM003
UPDATE Permintaan_Produk
SET status_permintaan = 'Disetujui'
WHERE id_permintaan = 'PM003';

-- Memverifikasi jadwal produksi JP004
UPDATE Jadwal_Produksi
SET status_verifikasi = 'Terverifikasi',
    status_jadwal     = 'Terjadwal'
WHERE id_jadwalproduksi = 'JP004';

-- Menambah stok produk P01 setelah hasil produksi ulang (+7)
UPDATE Produk
SET stok_produk = stok_produk + 7
WHERE id_produk = 'P01';

-- Cek hasil UPDATE
SELECT id_permintaan, status_permintaan FROM Permintaan_Produk WHERE id_permintaan = 'PM003';
SELECT id_jadwalproduksi, status_verifikasi, status_jadwal FROM Jadwal_Produksi WHERE id_jadwalproduksi = 'JP004';
SELECT id_produk, stok_produk FROM Produk WHERE id_produk = 'P01';

COMMIT;

-- Demonstrasi ON UPDATE CASCADE
BEGIN;
INSERT INTO Pengguna VALUES ('A98', 'Pengguna Uji', 'pengguna.uji', md5('uji'), 'Admin', TRUE, 'uji@keripikcabe.co.id');
INSERT INTO Admin VALUES ('AD98', 'A98');

UPDATE Pengguna SET id_pengguna = 'A97' WHERE id_pengguna = 'A98';

SELECT id_admin, id_pengguna FROM Admin WHERE id_admin = 'AD98';  -- id_pengguna sudah menjadi A97

DELETE FROM Admin    WHERE id_admin = 'AD98';
DELETE FROM Pengguna WHERE id_pengguna = 'A97';
COMMIT;



-- Menguji ON DELETE RESTRICT: menghapus produk P01 HARUS GAGAL
DO $$
BEGIN
    DELETE FROM Produk WHERE id_produk = 'P01';
    RAISE NOTICE 'PERINGATAN: delete berhasil, RESTRICT tidak bekerja!';
EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'OK: Produk P01 tidak bisa dihapus (ON DELETE RESTRICT bekerja).';
END $$;

-- Menghapus data yang AMAN (tidak punya anak): buat data sementara
BEGIN;
INSERT INTO Permintaan_Produk (id_permintaan, tanggal_permintaan, jumlah_diminta, keterangan_permintaan,
                               status_permintaan, id_produk, id_admin)
VALUES ('PM999', '2026-10-01', 10, 'Data uji untuk DELETE', 'Ditolak', 'P02', 'AD01');

DELETE FROM Permintaan_Produk WHERE id_permintaan = 'PM999';

SELECT COUNT(*) AS sisa_pm999 FROM Permintaan_Produk WHERE id_permintaan = 'PM999';  -- 0
COMMIT;

-- COUNT: jumlah pengguna per peran
SELECT role, COUNT(*) AS jumlah_pengguna
FROM Pengguna
GROUP BY role
ORDER BY role;

-- COUNT: jumlah permintaan per status
SELECT status_permintaan, COUNT(*) AS jumlah_permintaan
FROM Permintaan_Produk
GROUP BY status_permintaan;

-- SUM: total bahan baku yang diterima per bahan
SELECT bb.nama_bahan, bb.satuan, SUM(pb.jumlah_diterima) AS total_diterima
FROM Penerimaan_Bahan_Baku pb
INNER JOIN Bahan_Baku bb ON bb.id_bahan = pb.id_bahan
GROUP BY bb.nama_bahan, bb.satuan
ORDER BY total_diterima DESC;

-- SUM: total produksi per jadwal produksi
SELECT id_jadwalproduksi, SUM(jumlah_hasil) AS total_hasil, COUNT(*) AS jumlah_pencatatan
FROM Hasil_Produksi
GROUP BY id_jadwalproduksi
ORDER BY id_jadwalproduksi;

-- SUM + COUNT: ringkasan QC (diperiksa, lolos, reject)
SELECT COUNT(*)              AS jumlah_pemeriksaan,
       SUM(jumlah_diperiksa) AS total_diperiksa,
       SUM(jumlah_lolos)     AS total_lolos,
       SUM(jumlah_reject)    AS total_reject
FROM Hasil_Pemeriksaan_QC;

-- COUNT dengan HAVING: hasil QC yang punya lebih dari 1 tindakan perbaikan
SELECT id_hasilqc, COUNT(*) AS jumlah_tindakan
FROM Tindakan_Perbaikan
GROUP BY id_hasilqc
HAVING COUNT(*) > 1;

-- iSUM: total jumlah_target produksi per produk
SELECT pr.nama_produk, SUM(jp.jumlah_target) AS total_target
FROM Jadwal_Produksi jp
INNER JOIN Permintaan_Produk pm ON pm.id_permintaan = jp.id_permintaan
INNER JOIN Produk pr            ON pr.id_produk     = pm.id_produk
GROUP BY pr.nama_produk
ORDER BY total_target DESC;

