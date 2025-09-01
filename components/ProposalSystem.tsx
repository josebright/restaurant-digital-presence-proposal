"use client"

import React, { useMemo, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Preloader, FullScreenPreloader } from "@/components/ui/preloader"
import { 
  SERVICE_CATEGORIES, 
  DEVELOPMENT_APPROACHES, 
  SAMPLE_WEBSITES,
  type DevelopmentApproach 
} from "@/lib/services"
import { formatCurrency, formatDays, formatWeeks } from "@/lib/utils"
import { 
  Globe, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Store, 
  Megaphone, 
  Search, 
  Camera, 
  Wrench,
  Clock,
  Euro,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
  Info,
  User,
  FileText,
  Share2,
  Mail,
  Copy,
  Download,
  Settings
} from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const ICONS = {
  "core-website": Globe,
  "ecommerce": ShoppingCart,
  "payments-delivery": CreditCard,
  "marketplaces": Store,
  "marketing-crm": Megaphone,
  "seo-analytics": Search,
  "content-production": Camera,
  "maintenance": Wrench
}

export default function ProposalSystem() {
  const [approach, setApproach] = useState<DevelopmentApproach>("nocode")
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({
    discovery: true,
    "uiux-design": true,
    "core-pages": true,
    "online-ordering": true,
    "payment-gateway": true,
    "google-business": true,
    "local-seo": true,
    "analytics-dashboard": true,
    "gdpr-compliance": true,
    "hosting-platform": true,
    "maintenance-support": true,
  })
  const [rushDelivery, setRushDelivery] = useState(false)
  const [contingencyPercentage, setContingencyPercentage] = useState(15)
  const [clientName, setClientName] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [currentStep, setCurrentStep] = useState("services")

  const flatServices = useMemo(() => 
    SERVICE_CATEGORIES.flatMap(cat => cat.services), []
  )

  const oneOffTotal = useMemo(() => {
    return flatServices
      .filter(service => !service.recurring && selectedServices[service.id])
      .reduce((sum, service) => sum + service.price[approach], 0)
  }, [flatServices, selectedServices, approach])

  const recurringTotal = useMemo(() => {
    return flatServices
      .filter(service => service.recurring && selectedServices[service.id])
      .reduce((sum, service) => sum + (service.recurring?.monthly || 0), 0)
  }, [flatServices, selectedServices])

  const totalDays = useMemo(() => {
    const base = flatServices
      .filter(service => selectedServices[service.id])
      .reduce((sum, service) => sum + service.days[approach], 0)
    const rushMultiplier = rushDelivery ? 0.75 : 1
    return Math.ceil(base * rushMultiplier)
  }, [flatServices, selectedServices, approach, rushDelivery])

  const estimatedWeeks = useMemo(() => {
    const weeks = Math.max(1, Math.ceil(totalDays / 4.5))
    return weeks
  }, [totalDays])

  const contingencyAmount = Math.round((oneOffTotal * contingencyPercentage) / 100)
  const grandTotal = oneOffTotal + contingencyAmount

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }))
  }

  const toggleCategory = (categoryId: string, checked: boolean) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId)
    if (category) {
      const newSelection = { ...selectedServices }
      category.services.forEach(service => {
        newSelection[service.id] = checked
      })
      setSelectedServices(newSelection)
    }
  }

  const getCategorySelection = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId)
    if (!category) return { selected: 0, total: 0 }
    
    const selected = category.services.filter(service => selectedServices[service.id]).length
    return { selected, total: category.services.length }
  }

  // Export and sharing functionality
  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const element = document.getElementById('proposal-content')
      if (!element) return
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(`restaurant-proposal-${restaurantName || 'client'}.pdf`)
      setSuccessMessage('PDF generated successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setSuccessMessage('Error generating PDF. Please try again.')
      setIsSuccessModalOpen(true)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const emailToClient = () => {
    if (!clientEmail) {
      setSuccessMessage('Please enter the client email address first.')
      setIsSuccessModalOpen(true)
      return
    }
    
    // Show email modal with the proposal content
    setIsEmailModalOpen(true)
  }

  const copyEmailContent = async () => {
    setIsCopying(true)
    const subject = `Digital Presence Proposal - ${restaurantName || 'Restaurant'}`
    const body = generateEmailBody()
    
    const emailContent = `TO: ${clientEmail}
FROM: noreply@capacitydey.org
SUBJECT: ${subject}

${body}

---
Please copy this content and send it from your email client.`
    
    try {
      await navigator.clipboard.writeText(emailContent)
      setSuccessMessage('Email content copied to clipboard! Please paste it into your email client.')
      setIsSuccessModalOpen(true)
      setIsEmailModalOpen(false)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setSuccessMessage('Email content:\n\n' + emailContent)
      setIsSuccessModalOpen(true)
      setIsEmailModalOpen(false)
    } finally {
      setIsCopying(false)
    }
  }

  const openEmailClient = () => {
    const subject = `Digital Presence Proposal - ${restaurantName || 'Restaurant'}`
    const body = generateEmailBody()
    
    // Note: mailto: protocol cannot set the "from" address
    // The "from" will be the user's default email client
    // But we include it in the email body for clarity
    const mailtoLink = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    try {
      window.open(mailtoLink)
      setIsEmailModalOpen(false)
    } catch (error) {
      console.error('Error opening email client:', error)
      setSuccessMessage('Could not open email client. Please copy the content manually.')
      setIsSuccessModalOpen(true)
    }
  }

  const copySummary = async () => {
    setIsCopying(true)
    try {
      const summary = generateSummaryText()
      await navigator.clipboard.writeText(summary)
      setSuccessMessage('Summary copied to clipboard!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generateSummaryText()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setSuccessMessage('Summary copied to clipboard!')
      setIsSuccessModalOpen(true)
    } finally {
      setIsCopying(false)
    }
  }

  const goToStep = (step: string) => {
    setCurrentStep(step)
    // Smooth scroll to the "Project Setup Steps" section when changing steps
    const projectSetupSection = document.querySelector('[data-section="project-setup"]')
    if (projectSetupSection) {
      projectSetupSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const exportData = () => {
    setIsExporting(true)
    try {
      const data = {
        clientName,
        restaurantName,
        approach,
        selectedServices: Object.keys(selectedServices).filter(key => selectedServices[key]),
        rushDelivery,
        contingencyPercentage,
        oneOffTotal,
        recurringTotal,
        totalDays,
        estimatedWeeks,
        grandTotal,
        timestamp: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `restaurant-proposal-data-${restaurantName || 'client'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setSuccessMessage('Data exported successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error exporting data:', error)
      setSuccessMessage('Error exporting data. Please try again.')
      setIsSuccessModalOpen(true)
    } finally {
      setIsExporting(false)
    }
  }

  const generateEmailBody = () => {
    const selectedServicesList = flatServices
      .filter(service => selectedServices[service.id])
      .map(service => `• ${service.label}`)
      .join('\n')
    
    return `Dear ${clientName || 'Client'},

Thank you for your interest in our restaurant digital presence services.

PROJECT SUMMARY:
Restaurant: ${restaurantName || 'Your Restaurant'}
Development Approach: ${DEVELOPMENT_APPROACHES.find(a => a.key === approach)?.label}
Timeline: ${formatWeeks(estimatedWeeks)} (${formatDays(totalDays)} effort days)
${rushDelivery ? 'Accelerated Delivery: Yes (-25% timeline)' : 'Standard Delivery'}

SELECTED SERVICES:
${selectedServicesList}

COST BREAKDOWN:
One-time Investment: ${formatCurrency(oneOffTotal)}
Contingency (${contingencyPercentage}%): ${formatCurrency(contingencyAmount)}
Total Investment: ${formatCurrency(grandTotal)}
Monthly Recurring: ${formatCurrency(recurringTotal)}

This is a preliminary estimate. A detailed Statement of Work (SOW) will be provided after our discovery phase.

Best regards,
Capacity Dey Team
noreply@capacitydey.org`
  }

  const generateSummaryText = () => {
    const selectedServicesList = flatServices
      .filter(service => selectedServices[service.id])
      .map(service => `• ${service.label}`)
      .join('\n')
    
    return `RESTAURANT DIGITAL PRESENCE PROPOSAL

Client: ${clientName || 'N/A'}
Restaurant: ${restaurantName || 'N/A'}
Development Approach: ${DEVELOPMENT_APPROACHES.find(a => a.key === approach)?.label}

TIMELINE:
Project Duration: ${formatWeeks(estimatedWeeks)}
Effort Days: ${formatDays(totalDays)}
${rushDelivery ? 'Accelerated Delivery: Yes' : 'Standard Delivery'}

SELECTED SERVICES:
${selectedServicesList}

COST BREAKDOWN:
One-time Investment: ${formatCurrency(oneOffTotal)}
Contingency (${contingencyPercentage}%): ${formatCurrency(contingencyAmount)}
Total Investment: ${formatCurrency(grandTotal)}
Monthly Recurring: ${formatCurrency(recurringTotal)}

Generated on: ${new Date().toLocaleDateString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div id="proposal-content" className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Restaurant Digital Presence Proposal
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional proposal system for restaurant digital transformation. 
            Select your services, choose your development approach, and get a detailed cost estimate.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <a 
              href="https://usertrybe.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Usertrybe.com
            </a>
          </div>
        </motion.header>

        {/* Client Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  placeholder="Enter restaurant name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="Enter client email address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Development Approach Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Development Approach
              </CardTitle>
              <p className="text-gray-600">
                Choose the development approach that best fits your budget and timeline requirements.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={approach} 
                onValueChange={(value) => setApproach(value as DevelopmentApproach)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {DEVELOPMENT_APPROACHES.map((devApproach) => (
                  <motion.label
                    key={devApproach.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${
                      approach === devApproach.key
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <RadioGroupItem value={devApproach.key} className="flex-shrink-0 mt-1" />
                      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        <div>
                          <div className="font-semibold text-base sm:text-lg break-words">{devApproach.label}</div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium break-words">{devApproach.subtitle}</div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">{devApproach.description}</p>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                              <span className="font-medium">Best for:</span>
                            </div>
                            <span className="text-gray-600 break-words">{devApproach.bestFor}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="font-medium text-green-700">Pros:</div>
                            <ul className="space-y-1">
                              {devApproach.pros.map((pro, idx) => (
                                <li key={idx} className="text-gray-600 break-words">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-red-700">Cons:</div>
                            <ul className="space-y-1">
                              {devApproach.cons.map((con, idx) => (
                                <li key={idx} className="text-gray-600 break-words">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.label>
                ))}
              </RadioGroup>

              <Separator />

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Switch 
                    checked={rushDelivery} 
                    onCheckedChange={setRushDelivery} 
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center gap-1 sm:gap-2 group relative flex-1 min-w-0">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 cursor-help flex-shrink-0" />
                    <Label className="font-medium text-sm sm:text-base break-words">Accelerated Delivery</Label>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 border border-gray-700">
                      <div className="text-center">
                        <div className="font-semibold mb-1">Accelerated Delivery</div>
                        <div className="text-xs">Reduces project timeline by 25%</div>
                        <div className="text-xs text-yellow-300">May increase costs due to resource allocation</div>
                        <div className="text-xs text-blue-300 mt-1">
                          Current: {rushDelivery ? `${formatWeeks(Math.ceil(estimatedWeeks * 0.75))}` : `${formatWeeks(estimatedWeeks)}`}
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs flex-shrink-0">
                    -25% timeline
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-1 sm:gap-2 group relative">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 cursor-help flex-shrink-0" />
                    <Label className="font-medium text-sm sm:text-base whitespace-nowrap">Contingency</Label>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 border border-gray-700">
                      <div className="text-center">
                        <div className="font-semibold mb-1">Contingency Buffer</div>
                        <div className="text-xs">Additional budget for project variations</div>
                        <div className="text-xs text-yellow-300">Covers scope changes, delays, and unforeseen requirements</div>
                        <div className="text-xs text-blue-300 mt-1">
                          Current: +{formatCurrency(contingencyAmount)} ({contingencyPercentage}%)
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Slider 
                      className="w-24 sm:w-32 flex-1" 
                      value={[contingencyPercentage]} 
                      onValueChange={(value) => setContingencyPercentage(value[0])} 
                      min={0} 
                      max={30} 
                      step={5} 
                    />
                    <Badge variant="outline" className="min-w-[50px] sm:min-w-[60px] text-xs">
                      {contingencyPercentage}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-4" data-section="project-setup">
            <h2 className="text-lg font-bold text-gray-800">Project Setup Steps</h2>
          </div>
          
          <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white h-auto">
              <TabsTrigger 
                value="services" 
                className="py-2 px-1 sm:px-3 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">1. Select Services</span>
                <span className="sm:hidden">1. Services</span>
              </TabsTrigger>
              <TabsTrigger 
                value="summary" 
                className="py-2 px-1 sm:px-3 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">2. Project Summary</span>
                <span className="sm:hidden">2. Summary</span>
              </TabsTrigger>
              <TabsTrigger 
                value="samples" 
                className="py-2 px-1 sm:px-3 text-xs sm:text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">3. Sample Websites</span>
                <span className="sm:hidden">3. Samples</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              {SERVICE_CATEGORIES.map((category) => {
                const IconComponent = ICONS[category.id as keyof typeof ICONS]
                const { selected, total } = getCategorySelection(category.id)
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {IconComponent && <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />}
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-lg sm:text-xl break-words">{category.name}</CardTitle>
                              <p className="text-sm sm:text-base text-gray-600 break-words">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Badge variant="outline" className="self-start sm:self-center">
                              {selected}/{total} selected
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleCategory(category.id, true)}
                                disabled={selected === total}
                                className="whitespace-nowrap text-xs sm:text-sm"
                              >
                                Select All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleCategory(category.id, false)}
                                disabled={selected === 0}
                                className="whitespace-nowrap text-xs sm:text-sm"
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {category.services.map((service) => (
                            <motion.div
                              key={service.id}
                              whileHover={{ scale: 1.01 }}
                              className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                                selectedServices[service.id]
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Checkbox
                                id={service.id}
                                checked={!!selectedServices[service.id]}
                                onCheckedChange={() => toggleService(service.id)}
                                className="flex-shrink-0 mt-0.5"
                              />
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                                  <label 
                                    htmlFor={service.id} 
                                    className="font-medium cursor-pointer flex-1 break-words text-sm sm:text-base"
                                  >
                                    {service.label}
                                    {service.essential && (
                                      <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                                        Essential
                                      </Badge>
                                    )}
                                  </label>
                                </div>
                                
                                {service.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">{service.description}</p>
                                )}
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm">
                                  <Badge variant="outline" className="self-start">
                                    {service.recurring 
                                      ? `${formatCurrency(service.recurring.monthly)}/mo`
                                      : formatCurrency(service.price[approach])
                                    }
                                  </Badge>
                                  {!service.recurring && (
                                    <span className="text-gray-500 text-xs sm:text-sm">
                                      • {formatDays(service.days[approach])} effort
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
              
              {/* Next Step Button - End of Step 1 */}
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => goToStep("summary")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Next: Project Summary →
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              {/* Previous Step Button */}
              <div className="flex justify-start mb-4">
                <Button 
                  variant="outline"
                  onClick={() => goToStep("services")}
                  className="text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400 px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  ← Back to Services
                </Button>
              </div>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Summary & Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cost Breakdown */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Euro className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">One-time Cost</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-900">{formatCurrency(oneOffTotal)}</div>
                      <div className="text-sm text-blue-600 mt-1">Excluding VAT</div>
                    </div>
                    
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Contingency</span>
                      </div>
                      <div className="text-3xl font-bold text-green-900">{formatCurrency(contingencyAmount)}</div>
                      <div className="text-sm text-green-600 mt-1">{contingencyPercentage}% buffer</div>
                    </div>
                    
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Total Investment</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-900">{formatCurrency(grandTotal)}</div>
                      <div className="text-sm text-purple-600 mt-1">Including contingency</div>
                    </div>
                  </div>

                  {/* Timeline & Recurring */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">Recurring Monthly</span>
                      </div>
                      <div className="text-3xl font-bold text-orange-900">{formatCurrency(recurringTotal)}</div>
                      <div className="text-sm text-orange-600 mt-1">Ongoing costs</div>
                    </div>
                    
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">Development Time</span>
                      </div>
                      <div className="text-3xl font-bold text-indigo-900">{formatDays(totalDays)}</div>
                      <div className="text-sm text-indigo-600 mt-1">Effort days</div>
                    </div>
                    
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-pink-50 to-pink-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-pink-600" />
                        <span className="text-sm font-medium text-pink-700">Project Timeline</span>
                      </div>
                      <div className="text-3xl font-bold text-pink-900">{formatWeeks(estimatedWeeks)}</div>
                      <div className="text-sm text-pink-600 mt-1">
                        {rushDelivery ? "Accelerated delivery" : "Standard delivery"}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Selected Services List */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Selected Services Breakdown</h3>
                    <div className="space-y-3">
                      {flatServices
                        .filter(service => selectedServices[service.id])
                        .map(service => (
                          <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium">{service.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {SERVICE_CATEGORIES.find(cat => 
                                  cat.services.some(s => s.id === service.id)
                                )?.name}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {service.recurring 
                                  ? `${formatCurrency(service.recurring.monthly)}/mo`
                                  : formatCurrency(service.price[approach])
                                }
                              </div>
                              {!service.recurring && (
                                <div className="text-sm text-gray-500">
                                  {formatDays(service.days[approach])}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• All prices are in EUR and exclude VAT (21% in Netherlands)</li>
                      <li>• Timeline estimates assume parallel development tracks and optimal resource allocation</li>
                      <li>• Platform fees (Webflow, Wix, WordPress hosting) are external and billed separately</li>
                      <li>• Payment gateway fees (iDEAL, cards) are transaction-based and external</li>
                      <li>• Marketplace commissions (Uber Eats, Thuisbezorgd) are external and vary by platform</li>
                      <li>• Final Statement of Work (SOW) will follow detailed discovery and requirements analysis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="samples" className="space-y-6">
              {/* Previous Step Button */}
              <div className="flex justify-start mb-4">
                <Button 
                  variant="outline"
                  onClick={() => goToStep("summary")}
                  className="text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400 px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  ← Back to Project Summary
                </Button>
              </div>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Sample Websites by Development Approach
                  </CardTitle>
                  <p className="text-gray-600">
                    Explore examples of restaurant websites built with each development approach.
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="nocode" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                      <TabsTrigger 
                        value="nocode" 
                        className="py-1 px-1 sm:px-2 text-xs sm:text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <span className="hidden sm:inline">No-Code</span>
                        <span className="sm:hidden">No-Code</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="cms" 
                        className="py-1 px-1 sm:px-2 text-xs sm:text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <span className="hidden sm:inline">CMS</span>
                        <span className="sm:hidden">CMS</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="custom" 
                        className="py-1 px-1 sm:px-2 text-xs sm:text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <span className="hidden sm:inline">Custom Dev</span>
                        <span className="sm:hidden">Custom</span>
                      </TabsTrigger>
                    </TabsList>

                    {(["nocode", "cms", "custom"] as const).map((approachType) => (
                      <TabsContent key={approachType} value={approachType} className="mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {SAMPLE_WEBSITES[approachType].map((sample, idx) => (
                            <motion.div
                              key={sample.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group"
                            >
                              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <div className="text-center p-4">
                                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Sample Website</p>
                                    <p className="text-xs text-gray-400">{sample.name}</p>
                                  </div>
                                </div>
                                                                 <CardContent className="p-4">
                                   <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                     {sample.name}
                                   </h4>
                                   {sample.description && (
                                     <p className="text-sm text-gray-600 mb-3 italic">
                                       {sample.description}
                                     </p>
                                   )}
                                   <div className="space-y-2">
                                     {sample.features.map((feature, featureIdx) => (
                                       <div key={featureIdx} className="flex items-center gap-2 text-sm text-gray-600">
                                         <CheckCircle className="h-3 w-3 text-green-500" />
                                         {feature}
                                       </div>
                                     ))}
                                   </div>
                                   <Button 
                                     variant="outline" 
                                     size="sm" 
                                     className="w-full mt-3 group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-200 hover:scale-105"
                                     onClick={() => window.open(sample.url, '_blank', 'noopener,noreferrer')}
                                   >
                                     <ExternalLink className="h-3 w-3 mr-2" />
                                     View Sample
                                   </Button>
                                 </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Export & Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Export & Share Proposal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Generate a professional proposal document or share this estimate with your team.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap"
                  onClick={generatePDF}
                  type="button"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <Preloader size="sm" color="white" className="mr-2" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate PDF Proposal
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={emailToClient}
                  type="button"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-blue-500 hover:text-blue-600 whitespace-nowrap"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Client
                </Button>
                <Button 
                  variant="outline"
                  onClick={copySummary}
                  type="button"
                  disabled={isCopying}
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-green-500 hover:text-green-600 whitespace-nowrap"
                >
                  {isCopying ? (
                    <>
                      <Preloader size="sm" className="mr-2" />
                      Copying...
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Summary
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={exportData}
                  type="button"
                  disabled={isExporting}
                  className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-purple-500 hover:text-purple-600 whitespace-nowrap"
                >
                  {isExporting ? (
                    <>
                      <Preloader size="sm" className="mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 py-8"
        >
          <p>Built for Dutch restaurants • Currency: EUR • Estimates only, not binding quotes</p>
          <p className="mt-1">© 2025 Restaurant Digital Presence Proposal System</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span>Powered by</span>
            <a 
              href="https://usertrybe.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Usertrybe.com
            </a>
          </div>
        </motion.footer>
      </div>

      {/* Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Proposal to Client"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Email Details</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div><strong>To:</strong> {clientEmail}</div>
              <div><strong>Subject:</strong> Digital Presence Proposal - {restaurantName || 'Restaurant'}</div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Note About "From" Address</h3>
            <p className="text-sm text-amber-800">
              Due to email security limitations, the "From" address will be your default email client. 
              However, the email content clearly shows it's from <strong>noreply@capacitydey.org </strong> 
              and includes our professional branding.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Email Content Preview</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line max-h-60 overflow-y-auto">
              {generateEmailBody()}
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-4">
            <Button 
              onClick={openEmailClient} 
              className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap"
              disabled={isCopying}
            >
              <Mail className="h-4 w-4 mr-2" />
              Open Email Client
            </Button>
            <Button 
              onClick={copyEmailContent} 
              variant="outline" 
              className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap"
              disabled={isCopying}
            >
              {isCopying ? (
                <>
                  <Preloader size="sm" className="mr-2" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success"
      >
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-700">{successMessage}</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setIsSuccessModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


