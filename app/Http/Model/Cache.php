<?php

namespace App\Http\Model;

class Cache
{

    /**
     * 缓存目录
     * @var
     */
    private static $cache_dir;

    /**
     * Cache constructor.
     */
    public function __construct()
    {
        self::$cache_dir = app()->storagePath('/cache');
        if (!is_dir(self::$cache_dir)) {
            $make_dir_result = mkdir(self::$cache_dir, 0777, true);
            if ($make_dir_result === false)
                return false;
        }
    }


    /**
     * 根据key获取值，会判断是否过期
     * @param $key
     * @return mixed
     */
    public static function get($key)
    {
        $cache_data = self::getItem($key);
        if ($cache_data === false || !is_array($cache_data)) return false;

        return $cache_data['data'];
    }

    /**
     * 添加或覆盖一个key
     * @param $key
     * @param $value
     * @param $expire
     * @return mixed
     */
    public static function set($key, $value, $expire = 0)
    {
        return self::setItem($key, $value, time(), $expire);
    }

    /**
     * 设置包含元数据的信息
     * @param $key
     * @param $value
     * @param $time
     * @param $expire
     * @return bool
     */
    private static function setItem($key, $value, $time, $expire)
    {
        $cache_file = self::createCacheFile($key);
        if ($cache_file === false) return false;

        $cache_data = array('data' => $value, 'time' => $time, 'expire' => $expire);
        $cache_data = json_encode($cache_data);

        $put_result = file_put_contents($cache_file, $cache_data);
        if ($put_result === false) return false;

        return true;
    }

    /**
     * 创建缓存文件
     * @param $key
     * @return bool|string
     */
    private static function createCacheFile($key)
    {
        $cache_file = self::path($key);
        if (!file_exists($cache_file)) {
            $directory = dirname($cache_file);
            if (!is_dir($directory)) {
                $make_dir_result = mkdir($directory, 0755, true);
                if ($make_dir_result === false) return false;
            }
            $create_result = touch($cache_file);
            if ($create_result === false) return false;
        }

        return $cache_file;
    }

    /**
     * 判断Key是否存在
     * @param $key
     * @return mixed
     */
    public static function has($key)
    {
        $value = self::get($key);
        if ($value === false) return false;

        return true;
    }

    /**
     * 加法递增
     * @param $key
     * @param int $value
     * @return mixed
     */
    public static function increment($key, $value = 1)
    {
        $item = self::getItem($key);
        if ($item === false) {
            $set_result = self::set($key, $value);
            if ($set_result === false) return false;
            return $value;
        }

        $check_expire = self::checkExpire($item);
        if ($check_expire === false) return false;

        $item['data'] += $value;

        $result = self::setItem($key, $item['data'], $item['time'], $item['expire']);
        if ($result === false) return false;

        return $item['data'];
    }

    /**
     * 减法递增
     * @param $key
     * @param int $value
     * @return mixed
     */
    public static function decrement($key, $value = 1)
    {
        $item = self::getItem($key);
        if ($item === false) {
            $value      = 0 - $value;
            $set_result = self::set($key, $value);
            if ($set_result === false) return false;
            return $value;
        }

        $check_expire = self::checkExpire($item);
        if ($check_expire === false) return false;

        $item['data'] -= $value;

        $result = self::setItem($key, $item['data'], $item['time'], $item['expire']);
        if ($result === false) return false;

        return $item['data'];
    }

    /**
     * 删除一个key，同事会删除缓存文件
     * @param $key
     * @return mixed
     */
    public static function delete($key)
    {
        $cache_file = self::path($key);
        if (file_exists($cache_file)) {
            $unlink_result = unlink($cache_file);
            if ($unlink_result === false) return false;
        }

        return true;
    }

    /**
     * 清楚所有缓存
     * @return mixed
     */
    public static function flush()
    {
        return self::delTree(self::cache_dir);
    }

    /**
     * 递归删除目录
     * @param $dir
     * @return bool
     */
    static function delTree($dir)
    {
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? self::delTree("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    /**
     * 根据key获取缓存文件路径
     *
     * @param  string $key
     * @return string
     */
    protected static function path($key)
    {
        $parts = array_slice(str_split($hash = md5($key), 2), 0, 2);
        return self::$cache_dir . '/' . implode('/', $parts) . '/' . $hash;
    }

    /**
     * 获取含有元数据的信息
     * @param $key
     * @return bool|mixed|string
     */
    protected static function getItem($key)
    {
        $cache_file = self::path($key);
        if (!file_exists($cache_file) || !is_readable($cache_file)) {
            return false;
        }

        $cache_data = file_get_contents($cache_file);
        if (empty($cache_data)) return false;
        $cache_data = json_decode($cache_data, true);
        if ($cache_data) {
            $check_expire = self::checkExpire($cache_data);
            if ($check_expire === false) {
                self::delete($key);
                return false;
            }
        }

        return $cache_data;
    }

    /**
     * 检查key是否过期
     * @param $cache_data
     * @return bool
     */
    protected static function checkExpire($cache_data)
    {
        $time      = time();
        $is_expire = intval($cache_data['expire']) !== 0 && (intval($cache_data['time']) + intval($cache_data['expire']) < $time);
        if ($is_expire) return false;

        return true;
    }

}