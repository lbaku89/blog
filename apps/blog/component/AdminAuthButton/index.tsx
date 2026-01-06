'use client'

import { Button, Label, Input } from '@common-ui'
import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@common-ui'
import { LogIn, LogOut } from 'lucide-react'

export const AdminAuthButton = ({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loginInputs, setLoginInputs] = useState({ id: '', password: '' })

  const handleLogin = () => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginInputs),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true)
          setDialogOpen(false)
        } else if (response.status === 401) {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.')
        }
      })
      .catch((error) => {
        alert('로그인 실패: ' + error.message)
      })
  }

  const handleLogout = () => {
    fetch('/api/logout')
      .then(() => {
        setIsLoggedIn(false)
      })
      .catch((error) => {
        alert('로그아웃 실패: ' + error.message)
      })
  }

  const handleClickAuthBtn = () => {
    if (isLoggedIn) {
      handleLogout()
    } else {
      setDialogOpen(true)
    }
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginInputs((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Dialog open={dialogOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" onClick={handleClickAuthBtn}>
            {isLoggedIn ? <LogOut /> : <LogIn />}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" onClickCloseButton={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="아이디">아이디</Label>
              <Input id="id" name="id" defaultValue={loginInputs.id} onChange={handleChangeInput} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="비밀번호">비밀번호</Label>
              <Input
                id="password"
                name="password"
                defaultValue={loginInputs.password}
                onChange={handleChangeInput}
                type="password"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            {/* <DialogClose asChild> */}
            <Button type="button" className="w-full" onClick={handleLogin}>
              로그인
            </Button>
            {/* </DialogClose> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
